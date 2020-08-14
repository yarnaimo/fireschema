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
} from '../..'
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

export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: string[]
}

const VersionSchema = documentSchema<IVersion>({})
const VersionAdapter = collectionAdapter<IVersion>()({})

const UserSchemaBase = {
  name: 'string',
  displayName: ['string', 'null'],
  age: 'int',
  tags: { [$array]: { id: 'int', name: 'string' } },
  timestamp: 'timestamp',
  options: { a: 'bool', b: 'string' },
} as const
export const UserSchema = documentSchema<IUser>(UserSchemaBase)
export const UserSchemaJson = documentSchema<IUser & { timestamp: string }>({
  ...UserSchemaBase,
  timestamp: 'string',
})
const _expectError = documentSchema<IUser>({
  // @ts-expect-error
  name: ['string', 'null'],
  // @ts-expect-error
  displayName: 'string',
  age: 'int',
  // @ts-expect-error
  tags: { [$array]: { id: 'string', name: 'string' } },
  timestamp: 'timestamp',
  // @ts-expect-error
  options: [{ a: 'bool', b: 'string' }, 'null'],
})
const UserAdapter = collectionAdapter<IUser>()({
  selectors: (q) => ({
    teen: () => q.where('age', '>=', 10).where('age', '<', 20),
  }),
})

export const PostASchema = documentSchema<IPostA>({
  type: 'string',
  text: 'string',
})
export const PostBSchema = documentSchema<IPostB>({
  type: 'string',
  texts: { [$array]: 'string' },
})
const PostAdapter = collectionAdapter<IPostA | IPostB>()({})

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
