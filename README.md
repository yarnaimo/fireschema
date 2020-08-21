# Fireschema

- [English (Translated by DeepL)](README.en.md)

Firestore のコレクション構造・スキーマ・アクセス制御などを定義したオブジェクトから自動で rules の生成やドキュメントの型付けなどを行うライブラリ

## Requirements

- **TypeScript** (>= 4.0)

## Install

```sh
yarn add fireschema
yarn add -D typescript ts-node
```

## Setup

### Custom Compiler / Transformer

Fireschema では TypeScript の AST から型情報を取得する目的で **Custom Transformer** を使用するため、ビルド時は **ttypescript** という Custom Compiler を使う必要があります。

Custom Compiler / Transformer を使用するには、設定ファイルに以下の内容を追加してください。

**package.json**

`ttsc` / `ts-node` は環境変数 `TS_NODE_PROJECT` を使うと任意の `tsconfig.json` が指定できます。

```json
{
  "scripts": {
    "build": "ttsc", // <- tsc
    "ts-node": "ts-node --compiler ttypescript" // <- ts-node
  }
}
```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "fireschema/transformer"
      }
    ]
  }
}
```

**jest.config.js**

```js
module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      compiler: 'ttypescript',
    },
  },
}
```

### Override Dependencies

fireschema が依存する一部のパッケージは **TypeScript 3.9** に依存しているため、Selective dependency resolutions で**依存関係を上書き**する必要があります。(yarn のみ対応)

```json
{
  "resolutions": {
    "fireschema/**/typescript": "^4.0.0"
  }
}
```

## Usage

**注意事項**

- fireschema は変数名に応じてコードを変換するため、**fireschema からのインポート以外で以下の変数名を使用しないでください**。
  - **`$documentSchema`**
  - **`$collectionAdapter`**
  - **`__$__`**

**Case**

- /users/{uid}
  - ユーザー (`User`)
- /users/{uid}/posts/{postId}
  - ユーザーの投稿 (`PostA` または `PostB`)

### 1. コレクション構造・スキーマ定義

スキーマ定義は **`firestoreSchema`** として named export してください。

```ts
import {
  $adapter,
  $allow,
  $collectionGroups,
  $docLabel,
  $documentSchema,
  $functions,
  $or,
  $schema,
  $collectionAdapter,
  createFirestoreSchema,
  FTypes,
} from '..'

// user
type User = {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options: { a: boolean }
}
const UserSchema = $documentSchema<User>()
const UserAdapter = $collectionAdapter<User>()({})

// post
type PostA = {
  type: 'a'
  tags: { id: number; name: string }[]
  text: string
}
type PostB = {
  type: 'b'
  tags: { id: number; name: string }[]
  texts: string[]
}
const PostSchema = $documentSchema<PostA | PostB>()
const PostAdapter = $collectionAdapter<PostA | PostB>()({
  selectors: (q) => ({
    byTag: (tag: string) => q.where('tags', 'array-contains', tag),
  }),
})

export const firestoreSchema = createFirestoreSchema({
  [$functions]: {
    // /admins/<uid> が存在するかどうか
    ['isAdmin()']: `
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    `,

    // アクセスしようとするユーザーの uid が {uid} と一致するかどうか
    ['matchesUser(uid)']: `
      return request.auth.uid == uid;
    `,
  },

  [$collectionGroups]: {
    users: {
      [$docLabel]: 'uid',
      [$schema]: UserSchema,
      [$adapter]: UserAdapter,
      [$allow]: {
        read: true,
      },
    },
  },

  // /users/{uid}
  users: {
    [$docLabel]: 'uid', // {uid} の部分
    [$schema]: UserSchema, // documentSchema
    [$adapter]: UserAdapter, // collectionAdapter
    [$allow]: {
      // アクセス制御
      read: true, // 誰でも可
      write: $or(['matchesUser(uid)', 'isAdmin()']), // {uid} と一致するユーザー or 管理者のみ可
    },

    // /users/{uid}/posts/{postId}
    posts: {
      [$docLabel]: 'postId',
      [$schema]: PostSchema,
      [$adapter]: PostAdapter,
      [$allow]: {
        read: true,
        write: $or(['matchesUser(uid)']), // {uid} と一致するユーザーのみ可
      },
    },
  },
})
```

### 2. firestore.rules 生成

```sh
yarn fireschema <スキーマのパス>.ts
```

`ttsc` / `ts-node` と同じく、環境変数 `TS_NODE_PROJECT` で任意の `tsconfig.json` が指定できます。

<details>
  <summary>生成される firestore.rules の例</summary>

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function matchesUser(uid) {
      return request.auth.uid == uid;
    }

    match /{path=**}/users/{uid} {
      allow read: if true;
    }

    match /users/{uid} {
      function __validator_0__(data) {
        return (
          data.name is string
            && ((data.displayName == null || !(displayName in data)) || data.displayName is string)
            && (data.age is int || data.age is float)
            && data.timestamp is timestamp
            && data.options.a is bool
        );
      }

      allow read: if true;
      allow write: if ((matchesUser(uid) || isAdmin()) && __validator_0__(request.resource.data));

      match /posts/{postId} {
        function __validator_1__(data) {
          return ((
            data.type == "a"
              && (data.tags.size() == 0 || ((data.tags[0].id is int || data.tags[0].id is float) && data.tags[0].name is string))
              && data.text is string
          ) || (
            data.type == "b"
              && (data.tags.size() == 0 || ((data.tags[0].id is int || data.tags[0].id is float) && data.tags[0].name is string))
              && (data.texts.size() == 0 || data.texts[0] is string)
          ));
        }

        allow read: if true;
        allow write: if (matchesUser(uid) && __validator_1__(request.resource.data));
      }
    }
  }
}
```

</details>

### 3. コレクション・ドキュメントの操作

#### コントローラの初期化

```ts
import firebase, { firestore, initializeApp } from 'firebase' // または firebase-admin
import { firestoreSchema } from '<スキーマファイルのパス>'

const app: firebase.app.App = initializeApp({
  // ...
})
const firestoreApp = app.firestore()

const $store: FirestoreController<
  typeof firestoreApp,
  typeof schema
> = initFirestore(firestore, firestoreApp, firestoreSchema)
```

#### コレクションの参照・データ取得

```ts
const users = $store.collection('root', 'users') // /users
const user = users.ref.doc('userId') // /users/userId

const posts = $store.collection(user, 'posts') // /users/userId/posts
const post = posts.ref.doc('123') // /users/userId/posts/123

const postSnapshot = await post.get() // DocumentSnapshot<PostA | PostB>

const postsSnapshot = await posts.ref.get() // get collection
const techPostsSnapshot = await posts.select.byTag('tech').get() // get query
```

コレクションの親ドキュメントを参照

```ts
const user = $store.parentOfCollection(posts.ref) // DocumentReference<User>
```

#### コレクショングループの参照・データ取得

```ts
const postsGroup = $store.collectionGroup(['users', 'posts'])
const techPostsSnapshot = await postsGroup.select.byTag('tech').get()
```

#### ドキュメントの作成・更新

- `create(docRef: DocumentReference<T>, data: T)`
- `setMerge(docRef: DocumentReference<T>, data: Partial<T>)`
- `update(docRef: DocumentReference<T>, data: Partial<T>)`
- `delete(docRef: DocumentReference<T>)`

```ts
await $store.create(user, {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: $store.FieldValue.serverTimestamp(),
}
```

**トランザクション処理**

- `get(docRef: DocumentReference<T>) => Promise<DocumentSnapshot<T>>`
- `create(docRef: DocumentReference<T>, data: T)`
- `setMerge(docRef: DocumentReference<T>, data: Partial<T>)`
- `update(docRef: DocumentReference<T>, data: Partial<T>)`
- `delete(docRef: DocumentReference<T>)`

```ts
await $store.runTransaction(async (tc) => {
  const snapshot = await tc.get(user)
  tc.setMerge(user, {
    age: snapshot.data()!.age + 1,
  })
})
```
