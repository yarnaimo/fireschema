import {
  $adapter,
  $allow,
  $collectionGroups,
  $collectionSchema,
  $docLabel,
  $functions,
  $or,
  $schema,
  createFirestoreSchema,
} from '../..'
import { FTypes } from '../../core/types'
import { Type } from '../../lib/type'

export type IVersion = {}

export type IUser = {
  name: string
  displayName: string | null
  age: number
  tags: { id: number; name: string }[]
  timestamp: FTypes.Timestamp
  options: { a: boolean; b: string } | undefined
}
export type IUserLocal = Type.Merge<IUser, { timestamp: string }>
export type IUserJson = Type.Merge<IUser, { timestamp: string }>

export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: string[]
}

const VersionSchema = $collectionSchema<IVersion>()({})
void (() => {
  const VersionSchemaError = $collectionSchema<IVersion>()({
    // @ts-expect-error decoder without U type
    decoder: (data) => data,
  })
})

export const decodeUser = (data: IUser) => ({
  ...data,
  timestamp: data.timestamp.toDate().toISOString(),
  id: undefined, // decode -> id追加 の順に行われるのを確認する用
})

export const UserSchema = $collectionSchema<IUser, IUserLocal>()({
  decoder: (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>): IUserLocal =>
    decodeUser(data),
  selectors: (q, firestoreStatic) => ({
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
    _teen: () => q.where('age', '>=', 10).where('age', '<', 20 + Math.random()),
    orderById: () => q.orderBy(firestoreStatic.FieldPath.documentId()),
  }),
})
void (() => {
  const UserSchemaError = $collectionSchema<IUser, IUserLocal>()({
    // @ts-expect-error decoder not specified
    decoder: undefined,
  })
})

export const PostSchema = $collectionSchema<IPostA | IPostB>()({})
export const PostASchema = $collectionSchema<IPostA>()({})

const getCurrentAuthUser = () => `getCurrentAuthUser()`
const isAdmin = () => `isAdmin()`
const isUserScope = (arg: string) => `isUserScope(${arg})`

export const firestoreSchema = createFirestoreSchema({
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
      [$schema]: UserSchema,
      [$allow]: {
        read: true,
      },
    },
  },

  versions: {
    [$docLabel]: 'version',
    [$schema]: VersionSchema,
    [$adapter]: null,
    [$allow]: {},

    users: {
      [$docLabel]: 'uid',
      [$schema]: UserSchema,
      [$allow]: {
        read: true,
        write: $or([isUserScope('uid')]),
        delete: isUserScope('uid'),
      },

      posts: {
        [$docLabel]: 'postId',
        [$schema]: PostSchema,
        [$allow]: {
          read: true,
          write: $or([isUserScope('uid')]),
          delete: isUserScope('uid'),
        },
      },

      privatePosts: {
        [$docLabel]: 'postId',
        [$schema]: PostASchema,
        [$allow]: {
          read: $or(['isAdmin()', 'isUserScope(uid)']),
          write: $or(['isUserScope(uid)']),
        },
      },
    },
  },
})
