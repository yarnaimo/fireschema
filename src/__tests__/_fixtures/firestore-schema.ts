import {
  $adapter,
  $allow,
  $collectionGroups,
  $docLabel,
  $functions,
  $or,
  $schema,
  adapter,
  createFireschema,
  dataSchema,
} from '../..'
import { FTypes } from '../../types'

export type IVersion = {}

export type IUser = {
  name: string
  displayName: string | null
  age: number
  tags: string[]
  timestamp: FTypes.Timestamp
}

export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: string[]
}

const VersionSchema = dataSchema<IVersion>({})
const VersionAdapter = adapter<IVersion>()({})

const UserSchema = dataSchema<IUser>({
  name: 'string',
  displayName: 'string | null',
  age: 'int',
  tags: 'list',
  timestamp: 'timestamp',
})
const UserAdapter = adapter<IUser>()({
  selectors: (q) => ({
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
  }),
})

const PostASchema = dataSchema<IPostA>({
  type: 'string',
  text: 'string',
})
const PostBSchema = dataSchema<IPostB>({
  type: 'string',
  texts: 'list',
})
const PostAdapter = adapter<IPostA | IPostB>()({})

const getCurrentAuthUser = () => `getCurrentAuthUser()`
const isAdmin = () => `isAdmin()`
const isUserScope = (arg: string) => `isUserScope(${arg})`

export const firestoreSchema = createFireschema({
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
        [$schema]: [PostASchema, PostBSchema],
        [$adapter]: PostAdapter,
        [$allow]: {
          read: true,
          write: $or([isUserScope('uid')]),
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
