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
} from '..'

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
    posts: {
      [$docLabel]: 'postId',
      [$schema]: PostSchema,
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
