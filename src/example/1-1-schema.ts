import { Merge } from 'type-fest'
import { z } from 'zod'

import { DataModel, FirestoreModel, rules, timestampType } from '../index.js'

export const UserType = z.object({
  name: z.string(),
  displayName: z.string().optional().nullable(),
  age: z.number().int(),
  timestamp: timestampType(),
  options: z.object({ a: z.boolean() }).optional(),
})

type User = z.infer<typeof UserType>
/* => {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options?: { a: boolean } | undefined
} */

type UserDecoded = Merge<User, { timestamp: Date }>

const UserModel = new DataModel({
  schema: UserType,
  decoder: (data: User): UserDecoded => ({
    ...data,
    timestamp: data.timestamp.toDate(),
  }),
})

const PostType = z.object({
  authorUid: z.string(),
  text: z.string(),
  tags: z.object({ id: z.number().int(), name: z.string() }).array(),
})

const PostModel = new DataModel({
  schema: PostType,
  selectors: (q) => ({
    byTag: (tag: string) => [
      q.where('tags', 'array-contains', tag),
      q.limit(20),
    ],
  }),
})

export const firestoreModel = new FirestoreModel({
  'function isAdmin()': `
    return exists(${rules.basePath}/admins/$(request.auth.uid));
  `,

  'function requestUserIs(uid)': `
    return request.auth.uid == uid;
  `,

  collectionGroups: {
    '/posts/{postId}': {
      allow: {
        read: true,
      },
    },
  },

  '/users/{uid}': {
    model: UserModel,
    allow: {
      read: true, // open access
      write: rules.or('requestUserIs(uid)', 'isAdmin()'),
    },

    '/posts/{postId}': {
      'function authorUidMatches()': `
        return request.resource.data.authorUid == uid;
      `,

      model: PostModel,
      allow: {
        read: true,
        write: rules.and('requestUserIs(uid)', 'authorUidMatches()'),
      },
    },
  },
})

export default firestoreModel
