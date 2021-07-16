import { expectType } from 'tsd'
import {
  $,
  $allow,
  $collectionGroups,
  $docLabel,
  $functions,
  $model,
  $or,
  DataModel,
  FTypes,
  InferSchemaType,
} from '../..'
import { FirestoreModel } from '../../core'
import { Type } from '../../lib/type'

const VersionType = { unknown: $.unknown }
expectType<{ unknown: unknown }>({} as InferSchemaType<typeof VersionType>)
expectType<InferSchemaType<typeof VersionType>>({} as { unknown: unknown })

const UserType = {
  name: $.string,
  displayName: $.union($.string, $.null),
  age: $.int,
  tags: $.array({ id: $.int, name: $.string }),
  timestamp: $.timestamp,
  options: $.optional({ a: $.bool, b: $.string }),
}
export type IUser = {
  name: string
  displayName: string | null
  age: number
  tags: { id: number; name: string }[]
  timestamp: FTypes.Timestamp
  options: { a: boolean; b: string } | undefined
}
expectType<IUser>({} as InferSchemaType<typeof UserType>)
export type IUserLocal = Type.Merge<IUser, { timestamp: string }>
export type IUserJson = Type.Merge<IUser, { timestamp: string }>
export const UserJsonType = { ...UserType, timestamp: $.string }

const PostAType = {
  type: $.literal('a'),
  text: $.string,
}
const PostBType = {
  type: $.literal('b'),
  texts: $.array($.string),
}
const PostType = $.union(PostAType, PostBType)
export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: string[]
}
export type IPost = IPostA | IPostB
expectType<IPost>({} as InferSchemaType<typeof PostType>)

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
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
    _teen: () => q.where('age', '>=', 10).where('age', '<', 20 + Math.random()),
    orderById: () => q.orderBy(firestoreStatic.FieldPath.documentId()),
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

const getCurrentAuthUser = () => `getCurrentAuthUser()`
const isAdmin = () => `isAdmin()`
const isUserScope = (arg: string) => `isUserScope(${arg})`

export const firestoreModel = new FirestoreModel({
  [$functions]: {
    // [getCurrentAuthUser()]: `
    //   return get(/databases/$(database)/documents/authUsers/$(request.auth.uid));
    // `,
    [isAdmin()]: `
      return ${getCurrentAuthUser()}.data.isAdmin == true;
    `,
    [isUserScope('uid')]: `
      return request.auth.uid == uid;
    `,
  },

  [$collectionGroups]: {
    users: {
      [$docLabel]: 'uid',
      [$model]: UserModel,
      [$allow]: {
        read: true,
      },
    },
  },

  versions: {
    [$docLabel]: 'version',
    [$model]: VersionModel,
    [$allow]: {},

    users: {
      [$docLabel]: 'uid',
      [$model]: UserModel,
      [$allow]: {
        read: true,
        write: $or([isUserScope('uid')]),
        delete: isUserScope('uid'),
      },

      posts: {
        [$docLabel]: 'postId',
        [$model]: PostModel,
        [$allow]: {
          read: true,
          write: $or([isUserScope('uid')]),
          delete: isUserScope('uid'),
        },
      },

      privatePosts: {
        [$docLabel]: 'postId',
        [$model]: PostAModel,
        [$allow]: {
          read: $or(['isAdmin()', 'isUserScope(uid)']),
          write: $or(['isUserScope(uid)']),
        },
      },
    },
  },
})

export default firestoreModel
