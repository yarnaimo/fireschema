import dayjs, { Dayjs } from 'dayjs'
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
} from '../..'
import { Type } from '../../lib/type'
import { FTypes } from '../../types'

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

const VersionSchema = $documentSchema<IVersion>()
const VersionAdapter = $collectionAdapter<IVersion>()({})

export const UserSchema = $documentSchema<IUser, IUserLocal>({
  decoder: (snap: FTypes.QueryDocumentSnap<IUser>): IUserLocal => {
    const data = snap.data()
    return {
      ...data,
      timestamp: dayjs(data.timestamp.toDate()),
    }
  },
})
const UserAdapter = $collectionAdapter<IUser>()({
  selectors: (q) => ({
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
  }),
})

export const PostSchema = $documentSchema<IPostA | IPostB>()
export const PostASchema = $documentSchema<IPostA>()
const PostAdapter = $collectionAdapter<IPostA | IPostB>()({})

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
      [$adapter]: UserAdapter,
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
      [$adapter]: UserAdapter,
      [$allow]: {
        read: true,
        write: $or([isUserScope('uid')]),
      },

      posts: {
        [$docLabel]: 'postId',
        [$schema]: PostSchema,
        [$adapter]: PostAdapter,
        [$allow]: {
          read: true,
          write: $or([isUserScope('uid')]),
          delete: isUserScope('uid'),
        },
      },

      privatePosts: {
        [$docLabel]: 'postId',
        [$schema]: PostASchema,
        [$adapter]: PostAdapter,
        [$allow]: {
          read: $or(['isAdmin()', 'isUserScope(uid)']),
          write: $or(['isUserScope(uid)']),
        },
      },
    },
  },
})
