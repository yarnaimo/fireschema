import {
  $adapter,
  $allow,
  $collectionAdapter,
  $collectionGroups,
  $docLabel,
  $documentSchema,
  $functions,
  $or,
  $schema,
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
        write: $or(['matchesUser(uid)']),
      },
    },
  },
})
