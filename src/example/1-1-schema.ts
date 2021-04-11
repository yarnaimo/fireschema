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
  options: { a: boolean } | undefined
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
    // whether /admins/<uid> exists
    ['isAdmin()']: `
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    `,

    // whether uid matches
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
    [$docLabel]: 'uid', // {uid}
    [$schema]: UserSchema, // collectionSchema
    [$allow]: {
      // access control
      read: true, // all user
      write: $or(['matchesUser(uid)', 'isAdmin()']), // only users matching {uid} or admins
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
