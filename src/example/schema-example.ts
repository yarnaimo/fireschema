import {
  $adapter,
  $allow,
  $array,
  $collectionGroups,
  $docLabel,
  $functions,
  $or,
  $schema,
  collectionAdapter,
  createFirestoreSchema,
  documentSchema,
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
const UserSchema = documentSchema<User>({
  name: 'string',
  displayName: ['string', 'null'],
  age: 'int',
  timestamp: 'timestamp',
  options: { a: 'bool' },
})
const UserAdapter = collectionAdapter<User>()({})

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
const PostASchema = documentSchema<PostA>({
  type: 'string',
  tags: { [$array]: { id: 'int', name: 'string' } },
  text: 'string',
})
const PostBSchema = documentSchema<PostB>({
  type: 'string',
  tags: { [$array]: { id: 'int', name: 'string' } },
  texts: { [$array]: 'string' },
})
const PostAdapter = collectionAdapter<PostA | PostB>()({
  selectors: (q) => ({
    byTag: (tag: string) => q.where('tags', 'array-contains', tag),
  }),
})

export const schema = createFirestoreSchema({
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
      [$schema]: [PostASchema, PostBSchema], // PostASchema or PostBSchema
      [$adapter]: PostAdapter,
      [$allow]: {
        read: true,
        write: $or(['matchesUser(uid)']),
      },
    },
  },
})
