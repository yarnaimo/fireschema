import {
  $adapter,
  $allow,
  $docLabel,
  $functions,
  $or,
  $schema,
  adapter,
  createFireschema,
  dataSchema,
} from '../..'

export type IVersion = {}

export type IUser = {
  name: string
  displayName: string | null
  age: number
  tags: string[]
}

export type IPostA = {
  type: 'a'
  text: string
}
export type IPostB = {
  type: 'b'
  texts: number[]
}

const VersionSchema = dataSchema<IVersion>({})
const VersionAdapter = adapter<IVersion>()({})

const UserSchema = dataSchema<IUser>({
  name: 'string',
  displayName: 'string | null',
  age: 'int',
  tags: 'list',
})
const UserAdapter = adapter<IUser>()({
  selectors: (q) => ({
    adults: () => q.where('age', '>=', 18),
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

export const schema = createFireschema({
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

  versions: {
    [$schema]: VersionSchema,
    [$adapter]: VersionAdapter,
    [$docLabel]: 'version',
    [$allow]: {},

    users: {
      [$schema]: UserSchema,
      [$adapter]: UserAdapter,
      [$docLabel]: 'uid',
      [$allow]: {
        read: true,
        write: $or([isUserScope('uid')]),
      },

      posts: {
        [$schema]: [PostASchema, PostBSchema],
        [$adapter]: PostAdapter,
        [$docLabel]: 'postId',
        [$allow]: {
          read: true,
          write: $or([isUserScope('uid')]),
        },
      },

      privatePosts: {
        [$schema]: PostASchema,
        [$adapter]: PostAdapter,
        [$docLabel]: 'postId',
        [$allow]: {
          read: $or(['isAdmin()', 'isUserScope(uid)']),
          write: $or(['isUserScope(uid)']),
        },
      },
    },
  },
})
