# Fireschema

Firestore のスキーマを定義してバリデーションを含むセキュリティルールを自動生成するツール

## Install

```sh
yarn add fireschema
# or
npm i -S fireschema
```

## Usage

**Case**

- /users/{uid}
  - ユーザー (`IUser`)
- /users/{uid}/posts/{post}
  - ユーザーの投稿 (`IPostA` または `IPostB`)

```ts
import {
  $allow,
  $docLabel,
  $functions,
  $or,
  $schema,
  dataSchema,
  fireschema,
} from 'fireschema'

type IUser = {
  name: string
  displayName: string | null
  age: number
}

type IPostA = {
  type: 'a'
  text: string
}
type IPostB = {
  type: 'b'
  texts: number[]
}

const UserSchema = dataSchema<IUser>({
  name: 'string',
  displayName: 'string | null',
  age: 'int',
})

const PostASchema = dataSchema<IPostA>({
  type: 'string',
  text: 'string',
})
const PostBSchema = dataSchema<IPostB>({
  type: 'string',
  texts: 'list',
})

// const isAdmin = () => `'isAdmin()'`
// const isUserScope = (arg: string) => `isUserScope(${arg})`

const schema = fireschema({
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
    [$schema]: UserSchema,
    [$docLabel]: 'uid',
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
      [$schema]: [PostASchema, PostBSchema],
      [$docLabel]: 'postId',
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
      [$schema]: PostASchema,
      [$docLabel]: 'postId',
      [$allow]: {
        read: $or(['isAdmin()', 'isUserScope(uid)']),
        write: $or(['isUserScope(uid)']),
      },
    },
  },
})
```
