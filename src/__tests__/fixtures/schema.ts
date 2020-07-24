import {
  $adapter,
  $allow,
  $docLabel,
  $functions,
  $or,
  $schema,
  createFireschema,
  dataSchema,
} from '../..'
import { adapter } from '../../adapter'

const VersionSchema = dataSchema<{}>({})
const VersionAdapter = adapter<{}>({})

type IUser = {
  name: string
  displayName: string | null
  age: number
}

type IPostA = {
  type: 'a'
  text: string
}
type IPostB = {
  type: 'b'
  texts: number[]
}

const UserSchema = dataSchema<IUser>({
  name: 'string',
  displayName: 'string | null',
  age: 'int',
})
const UserAdapter = adapter<IUser>({})

const PostASchema = dataSchema<IPostA>({
  type: 'string',
  text: 'string',
})
const PostBSchema = dataSchema<IPostB>({
  type: 'string',
  texts: 'list',
})
const PostAdapter = adapter<IPostA | IPostB>({})

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
