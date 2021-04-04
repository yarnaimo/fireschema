[English (Translated by DeepL)](README.en.md)

# Fireschema

- Firestore のコレクション構造・スキーマ・アクセス制御などをオブジェクトで定義して、rules の生成やドキュメントの型付けなどを自動で行う
- Firestore Trigger のドキュメントや Callable Function の Request/Response の型付けを自動で行う

## Requirements

- **TypeScript** (>= 4.1)

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

Fireschema が依存する一部のパッケージは **TypeScript 3.9** に依存しているため、Selective dependency resolutions で**依存関係を上書き**する必要があります。(yarn のみ対応)

```json
{
  "resolutions": {
    "fireschema/**/typescript": "^4.1.2"
  }
}
```

## Usage (Firestore)

> 以下の変数名は特殊な意味を持つため、fireschema からのインポート以外で使用しないでください。
>
> - `$collectionSchema`
> - `__$__`

**Example**

- users/{uid}
  - ユーザー (`User`)
- users/{uid}/posts/{postId}
  - ユーザーの投稿 (`PostA` または `PostB`)

### 1. コレクション構造・スキーマ定義

スキーマ定義は **`firestoreSchema`** として named export してください。

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-1-schema.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-1-schema.ts -->

```ts
import { Merge } from 'type-fest'
import {
  $allow,
  $collectionGroups,
  $collectionSchema,
  $docLabel,
  $functions,
  $or,
  $schema,
  createFirestoreSchema,
  FTypes,
} from 'fireschema'

// user
export type User = {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options: { a: boolean }
}
export type UserDecoded = Merge<User, { timestamp: Date }>

const UserSchema = $collectionSchema<User, UserDecoded>()({
  decoder: (data) => ({
    ...data,
    timestamp: data.timestamp.toDate(),
  }),
})

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
const PostSchema = $collectionSchema<PostA | PostB>()({
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
      [$allow]: {
        read: true,
      },
    },
  },

  // /users/{uid}
  users: {
    [$docLabel]: 'uid', // {uid} の部分
    [$schema]: UserSchema, // collectionSchema
    [$allow]: {
      // アクセス制御
      read: true, // 誰でも可
      write: $or(['matchesUser(uid)', 'isAdmin()']), // {uid} と一致するユーザー or 管理者のみ可
    },

    // /users/{uid}/posts/{postId}
    posts: {
      [$docLabel]: 'postId',
      [$schema]: PostSchema,
      [$allow]: {
        read: true,
        write: 'matchesUser(uid)',
      },
    },
  },
})
```

<!-- AUTO-GENERATED-CONTENT:END -->

### 2. firestore.rules 生成

```sh
yarn fireschema <スキーマのパス>.ts
```

`ttsc` / `ts-node` と同じく、環境変数 `TS_NODE_PROJECT` で任意の `tsconfig.json` が指定できます。

<details>
  <summary>生成される firestore.rules の例</summary>

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./firestore.rules) -->
<!-- The below code snippet is automatically added from ./firestore.rules -->

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
            && ((data.displayName == null || !("displayName" in data)) || data.displayName is string)
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

<!-- AUTO-GENERATED-CONTENT:END -->

</details>

### 3. コレクション・ドキュメントの操作

Fireschema の Firestore コントローラは `RefAdapter` と `WriteAdapter` に分かれています。

`RefAdapter` は web/admin 共通で、`WriteAdapter` は web と admin それぞれ作成する必要があります。

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-3-adapter.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-3-adapter.ts -->

```ts
import firebase from 'firebase/app' // または firebase-admin
import {
  createFirestoreRefAdapter,
  createFirestoreWriteAdapter,
  FirestoreRefAdapter,
  FirestoreWriteAdapter,
} from 'fireschema'
import { firestoreSchema } from './1-1-schema'

/**
 * コントローラの初期化
 */
const app: firebase.app.App = firebase.initializeApp({
  // ...
})
export const firestoreApp = app.firestore()

export const $: FirestoreRefAdapter<
  typeof firestoreSchema
> = createFirestoreRefAdapter(firestoreSchema)
export const $web: FirestoreWriteAdapter<firebase.firestore.Firestore> = createFirestoreWriteAdapter(
  firebase.firestore,
  firestoreApp,
)

/**
 * コレクションの参照・データ取得
 */
const users = $.collection(firestoreApp, 'users') // /users
const user = users.doc('userId') // /users/userId

const posts = $.collection(user, 'posts') // /users/userId/posts
const post = posts.doc('123') // /users/userId/posts/123
const techPosts = $.collectionQuery(user, 'posts', (q) => q.byTag('tech'))

post.get() // Promise<DocumentSnapshot<PostA | PostB>>
posts.get() // Promise<QuerySnapshot<PostA | PostB>>
techPosts.get() // Promise<QuerySnapshot<PostA | PostB>>

/**
 * コレクションの親ドキュメントを参照
 */
const _user = $.getParentDocument(posts) // DocumentReference<User>

/**
 * DocumentReference に型をつける
 */
const untypedPostRef = firestoreApp.doc('users/{uid}/posts/post')
const _post = $.typeDocument('users/{uid}/posts', untypedPostRef) // DocumentReference<PostA | PostB>

/**
 * コレクショングループの参照・データ取得
 */
const postsGroup = $.collectionGroup(firestoreApp, 'users/{uid}/posts')
const techPostsGroup = $.collectionGroupQuery(
  firestoreApp,
  'users/{uid}/posts',
  (q) => q.byTag('tech'),
)

postsGroup.get() // Promise<QuerySnapshot<PostA | PostB>>
techPostsGroup.get() // Promise<QuerySnapshot<PostA | PostB>>

/**
 * ドキュメントの作成・更新
 */
$web.create(user, {
  name: 'test',
  displayName: 'Test',
  age: 20,
  timestamp: $web.FieldValue.serverTimestamp(),
  options: { a: true },
})
$web.setMerge(user, {
  age: 17,
})
$web.update(user, {
  age: 17,
})
$web.delete(user)

/**
 * トランザクション
 */
$web.runTransaction(async (tc) => {
  const snap = await tc.get(user)
  tc.setMerge(user, {
    age: snap.data()!.age + 1,
  })
})
```

<!-- AUTO-GENERATED-CONTENT:END -->

### 4. Hooks

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-4-hooks.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/1-4-hooks.tsx -->

```tsx
import React from 'react'
import {
  useDocumentSnapData,
  useQuerySnapData,
  useTypedDocument,
  useTypedQuery,
} from 'fireschema/hooks'
import { $, firestoreApp } from './1-3-adapter'

/**
 * コレクション/クエリをリアルタイムで表示
 */
export const UsersComponent = () => {
  const users = useTypedQuery($.collection(firestoreApp, 'users'))
  const usersData = useQuerySnapData(users.snap)
  if (!usersData) {
    return <span>{'Loading...'}</span>
  }

  return (
    <ul>
      {usersData.map((user, i) => (
        <li key={i}>{user.displayName}</li>
      ))}
    </ul>
  )
}

/**
 * ドキュメントをリアルタイムで表示
 */
export const UserComponent = ({ id }: { id: string }) => {
  const user = useTypedDocument($.collection(firestoreApp, 'users').doc(id))
  const userData = useDocumentSnapData(user.snap)
  if (!userData) {
    return <span>{'Loading...'}</span>
  }

  return <span>{userData.displayName}</span>
}
```

<!-- AUTO-GENERATED-CONTENT:END -->

## Usage (Functions)

Fireschema の Cloud Functions 型付け機能を利用するには、まず `FunctionRegisterer` を初期化し、各 Function で registerer をインポートしてスキーマや関数を定義します。

### 1. function の定義

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-1-registerer.ts) -->
<!-- The below code snippet is automatically added from ./src/example/2-1-registerer.ts -->

```ts
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Merge } from 'type-fest'
import { $jsonSchema, FunctionRegisterer } from 'fireschema'
import { firestoreSchema, User } from './1-1-schema'

/**
 * Registererを初期化
 */
const timezone = 'Asia/Tokyo'
const $register = FunctionRegisterer(
  firestoreSchema,
  firestore,
  functions,
  timezone,
)
const builder = functions.region('asia-northeast1')

/**
 * functionsのindexファイル (functions/index.tsなど)
 * (通常はfunctionごとにファイルを分割します)
 */
export type UserJson = Merge<User, { timestamp: string }>
export const callable = {
  createUser: $register.callable({
    schema: [$jsonSchema<UserJson>(), $jsonSchema<{ result: boolean }>()],
    builder,
    handler: async (data, context) => {
      console.log(data) // UserJson

      return { result: true }
    },
  }),
}

export const firestoreTrigger = {
  onUserCreate: $register.firestoreTrigger.onCreate({
    builder,
    path: 'users/{uid}',
    handler: async (decodedData, snap, context) => {
      console.log(decodedData) // UserDecoded (パス文字列から自動で型付け)
      console.log(snap) // QueryDocumentSnapshot<User>
    },
  }),
}

export const http = {
  getKeys: $register.http({
    builder,
    handler: (req, resp) => {
      if (req.method !== 'POST') {
        resp.status(400).send()
        return
      }
      resp.json(Object.keys(req.body))
    },
  }),
}

export const topic = {
  publishMessage: $register.topic('publish_message', {
    schema: $jsonSchema<{ text: string }>(),
    builder,
    handler: async (data) => {
      data // { text: string }
    },
  }),
}

export const schedule = {
  cron: $register.schedule({
    builder,
    schedule: '0 0 * * *',
    handler: async (context) => {
      console.log(context.timestamp)
    },
  }),
}
```

<!-- AUTO-GENERATED-CONTENT:END -->

### 2. callble function の呼び出し

callble function の client 作成時に functions の index モジュールの型をジェネリクスで渡すと、呼び出し時に自動で型付けが行われます。

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-2-callable.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/2-2-callable.tsx -->

```tsx
import firebase from 'firebase/app'
import React from 'react'
import { Caller } from 'fireschema'

type FunctionsModule = typeof import('./2-1-registerer')

const app: firebase.app.App = firebase.initializeApp({
  // ...
})
const functionsApp = app.functions('asia-northeast1')

export const $call = Caller<FunctionsModule>(functionsApp)

const Component = () => {
  const createUser = async () => {
    const result = await $call('createUser', {
      name: 'test',
      displayName: 'Test',
      age: 20,
      timestamp: new Date().toISOString(),
      options: { a: true },
    })

    if (!result.isOk) {
      console.error(result.error)
      return
    }
    console.log(result.value)
  }

  return <button onClick={createUser}></button>
}
```

<!-- AUTO-GENERATED-CONTENT:END -->
