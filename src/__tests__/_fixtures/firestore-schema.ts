import dayjs, { Dayjs } from 'dayjs'
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
  options: { a: boolean; b: string }
}
export type IUserLocal = Type.Merge<IUser, { timestamp: Dayjs }>
export type IUserJson = Type.Merge<IUser, { timestamp: string }>

export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: string[]
}

const VersionSchema = $collectionSchema<IVersion>()()

export const decodeUser = (data: IUser) => ({
  ...data,
  timestamp: dayjs(data.timestamp.toDate()),
  id: undefined, // decode -> id追加 の順に行われるのを確認する用
})

export const UserSchema = $collectionSchema<IUser, IUserLocal>()({
  decoder: (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>): IUserLocal =>
    decodeUser(data),
  selectors: (q) => ({
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
  }),
})

export const PostSchema = $collectionSchema<IPostA | IPostB>()()
export const PostASchema = $collectionSchema<IPostA>()()

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
