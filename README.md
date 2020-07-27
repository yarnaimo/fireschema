# Fireschema

Firestore のスキーマを定義してバリデーションを含むセキュリティルールを自動生成するツール

## Requirements

- **TypeScript** (>= 4.0)

## Install

```sh
yarn add fireschema
yarn add -D ts-node
# or
npm i -S fireschema
npm i -D ts-node
```

## Usage

### スキーマ定義・セキュリティルール生成

1. 以下のようにスキーマを定義する (`schema` として named export する)
2. `npx fireschema <スキーマのパス>`

**Case**

- /users/{uid}
  - ユーザー (`IUser`)
- /users/{uid}/posts/{postId}
  - ユーザーの投稿 (`IPostA` または `IPostB`)
- /users/{uid}/privatePosts/{postId}
  - ユーザーの非公開投稿 (`IPostA`)

```ts
import {
  $adapter,
  $allow,
  $docLabel,
  $functions,
  $or,
  $schema,
  adapter,
  createFireschema,
  dataSchema,
} from 'fireschema'

type IUser = {
  name: string
  displayName: string | null
  age: number
  tags: string[]
  timestamp: FTypes.Timestamp
}

type IPostA = {
  type: 'a'
  text: string
}
type IPostB = {
  type: 'b'
  texts: string[]
}

const UserSchema = dataSchema<IUser>({
  name: 'string',
  displayName: 'string | null',
  age: 'int',
  tags: 'list',
  timestamp: 'timestamp',
})
const UserAdapter = adapter<IUser>()({
  selectors: (q) => ({
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
  }),
})

const PostASchema = dataSchema<IPostA>({
  type: 'string',
  text: 'string',
})
const PostBSchema = dataSchema<IPostB>({
  type: 'string',
  texts: 'list',
})
const PostAdapter = adapter<IPostA | IPostB>()({})

// const isAdmin = () => `'isAdmin()'`
// const isUserScope = (arg: string) => `isUserScope(${arg})`

export const schema = createFireschema({
  [$functions]: {
    // /admins/<uid> が存在するかどうか
    ['isAdmin()']: `
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    `,

    // アクセスしようとするユーザーの uid が 一致するかどうか
    ['isUserScope(uid)']: `
      return request.auth.uid == uid;
    `,
  },

  /**
   * /users/{uid}
   * schema: UserSchema
   * rule:
   *   [read]: 誰でも可
   *   [write]: uid がユーザーと一致する場合のみ
   */
  users: {
    [$docLabel]: 'uid',
    [$schema]: UserSchema,
    [$adapter]: UserAdapter,
    [$allow]: {
      read: true,
      write: $or(['isUserScope(uid)']),
    },

    /**
     * /users/{uid}/posts/{postId}
     * schema: PostASchema または PostBSchema
     * rule:
     *   [read]: 誰でも可
     *   [write]: uid がユーザーと一致する場合のみ
     */
    posts: {
      [$docLabel]: 'postId',
      [$schema]: [PostASchema, PostBSchema],
      [$adapter]: PostAdapter,
      [$allow]: {
        read: true,
        write: $or(['isUserScope(uid)']),
      },
    },

    /**
     * /users/{uid}/privatePosts/{postId}
     * schema: PostASchema
     * rule:
     *   [read]: uid がユーザーと一致するか admin のみ
     *   [write]: uid がユーザーと一致する場合のみ
     */
    privatePosts: {
      [$docLabel]: 'postId',
      [$schema]: PostASchema,
      [$adapter]: PostAdapter,
      [$allow]: {
        read: $or(['isAdmin()', 'isUserScope(uid)']),
        write: $or(['isUserScope(uid)']),
      },
    },
  },
})
```

### a

```ts
import firebase, { firestore, initializeApp } from 'firebase' // or firebase-admin

const app: firebase.app.App = initializeApp({
  // ...
})
const firestoreApp = app.firestore()

const store: FirestoreController<
  typeof firestoreApp,
  typeof schema
> = initFirestore(firestore, firestoreApp, schema)

const users = storeAdmin.collection('root', 'users')
const user = users.ref.doc('user')

const posts = storeAdmin.collection(user, 'posts')
const post = posts.ref.doc('post')

const usersGroup = storeAdmin.collectionGroup(['users'])

user.get().then((snap) => snap.data()) // => IUser
```
