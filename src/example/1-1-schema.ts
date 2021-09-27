import { Merge } from 'type-fest'
import { z } from 'zod'
import {
  $allow,
  $collectionGroups,
  $functions,
  $model,
  $or,
  DataModel,
  docPath,
  FirestoreModel,
  InferSchemaType,
  timestampType,
} from '../index.js'

export const UserType = z.object({
  name: z.string(),
  displayName: z.union([z.string(), z.null()]),
  age: z.number().int(),
  timestamp: timestampType(),
  options: z.object({ a: z.boolean() }).optional(),
})
type User = InferSchemaType<typeof UserType>
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
  tags: z.object({ id: z.number().int(), name: z.string() }).array(),
  text: z.string(),
})

const PostModel = new DataModel({
  schema: PostType,
  selectors: (q) => ({
    byTag: (tag: string) => [q.where('tags', 'array-contains', tag)],
  }),
})

export const firestoreModel = new FirestoreModel({
  [$functions]: {
    'isAdmin()': `
      return exists(${docPath('admins/$(request.auth.uid)')});
    `,

    'requestUserIs(uid)': `
      return request.auth.uid == uid;
    `,
  },

  [$collectionGroups]: {
    'posts/{postId}': {
      [$model]: PostModel,
      [$allow]: {
        read: true,
      },
    },
  },

  'users/{uid}': {
    [$model]: UserModel,
    [$allow]: {
      read: true, // open access
      write: $or(['requestUserIs(uid)', 'isAdmin()']), // only users matching {uid} or admins
    },

    'posts/{postId}': {
      [$model]: PostModel,
      [$allow]: {
        read: true,
        write: 'requestUserIs(uid)',
      },
    },
  },
})

export default firestoreModel
