import { expectType } from 'tsd'
import { z } from 'zod'

import { FirestoreModel, docPath, timestampType } from '../../core/index.js'
import { $or, DataModel, FTypes } from '../../index.js'
import { Type } from '../../lib/type.js'

const VersionType = z.object({})

export const UserType = z.object({
  name: z.string(),
  displayName: z.union([z.string(), z.null()]),
  age: z.number().int(),
  tags: z.object({ id: z.number().int(), name: z.string() }).array(),
  timestamp: timestampType(),
  options: z.object({ a: z.boolean(), b: z.string() }).optional(),
})
export type IUser = {
  name: string
  displayName: string | null
  age: number
  tags: { id: number; name: string }[]
  timestamp: FTypes.Timestamp
  options?: { a: boolean; b: string } | undefined
}
type InferredUser = z.infer<typeof UserType>

expectType<IUser>({} as InferredUser)
export type IUserLocal = Type.Merge<IUser, { timestamp: string }>
export type IUserJson = Type.Merge<IUser, { timestamp: string }>
export const UserJsonType = UserType.extend({ timestamp: z.string() })

const PostAType = z.object({
  type: z.literal('a'),
  text: z.string(),
})
const PostBType = z.object({
  type: z.literal('b'),
  texts: z.string().array(),
})
const PostType = z.union([PostAType, PostBType])
export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: string[]
}
export type IPost = IPostA | IPostB
expectType<IPost>({} as z.infer<typeof PostType>)

const VersionModel = new DataModel({ schema: VersionType })
// void (() => {
//   const VersionSchemaError = $collectionSchema<IVersion>()({
//     // @ts-expect-error decoder without U type
//     decoder: (data) => data,
//   })
// })

export const decodeUser = (data: IUser) => ({
  ...data,
  timestamp: data.timestamp.toDate().toISOString(),
  id: undefined, // decode -> id追加 の順に行われるのを確認する用
})

export const UserModel = new DataModel({
  schema: UserType,
  decoder: (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>): IUserLocal =>
    decodeUser(data),

  selectors: (q, firestoreStatic) => ({
    _: () => [
      // @ts-expect-error wrong field path
      q.where('age_', '>=', 10),
    ],
    teen: () => [q.where('age', '>=', 10), q.where('age', '<', 20)],
    _teen: () => [
      q.where('age', '>=', 10),
      q.where('age', '<', 20 + Math.random()),
    ],
    orderById: () => [q.orderBy(firestoreStatic.documentId())],
  }),
})
// void (() => {
//   const UserSchemaError = $collectionSchema<IUser, IUserLocal>()({
//     // @ts-expect-error decoder not specified
//     decoder: undefined,
//   })
// })

export const PostModel = new DataModel({ schema: PostType })
export const PostAModel = new DataModel({ schema: PostAType })

export const firestoreModel = new FirestoreModel({
  'function getCurrentAuthUserDoc()': `
    return get(${docPath('authUsers/$(request.auth.uid)')});
  `,
  'function isAdmin()': `
    return getCurrentAuthUserDoc().data.isAdmin == true;
  `,
  'function requestUserIs(uid)': `
    return request.auth.uid == uid;
  `,

  collectionGroups: {
    '/users/{uid}': {
      allow: {
        read: true,
      },
    },
  },

  '/versions/{version}': {
    model: VersionModel,
    allow: {},

    '/users/{uid}': {
      model: UserModel,
      allow: {
        read: true,
        write: $or(['requestUserIs(uid)']),
        delete: 'requestUserIs(uid)',
      },

      '/posts/{postId}': {
        'function test()': `
          return true;
        `,

        model: PostModel,
        allow: {
          read: true,
          write: $or(['requestUserIs(uid)']),
          delete: 'requestUserIs(uid)',
        },
      },

      '/privatePosts/{postId}': {
        model: PostAModel,
        allow: {
          read: $or(['isAdmin()', 'requestUserIs(uid)']),
          write: $or(['requestUserIs(uid)']),
        },
      },
    },
  },
})

export default firestoreModel
