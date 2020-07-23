import { dataSchema, fireschema } from '../fireschema'
import { $allow, $docLabel, $functions, $or, $schema } from '../utils'

const VersionSchema = dataSchema<{}>({})

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

const PostASchema = dataSchema<IPostA>({
  type: 'string',
  text: 'string',
})
const PostBSchema = dataSchema<IPostB>({
  type: 'string',
  texts: 'list',
})

const getCurrentAuthUser = () => `getCurrentAuthUser()`
const isAdmin = () => `isAdmin()`
const isUserScope = (arg: string) => `isUserScope(${arg})`

const schema = fireschema({
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
    [$docLabel]: 'version',
    [$allow]: {},

    users: {
      [$schema]: UserSchema,
      [$docLabel]: 'uid',
      [$allow]: {
        read: true,
        write: $or([isUserScope('uid')]),
      },

      posts: {
        [$schema]: [PostASchema, PostBSchema],
        [$docLabel]: 'postId',
        [$allow]: {
          read: true,
          write: $or([isUserScope('uid')]),
        },
      },

      privatePosts: {
        [$schema]: PostASchema,
        [$docLabel]: 'postId',
        [$allow]: {
          read: $or(['isAdmin()', 'isUserScope(uid)']),
          write: $or(['isUserScope(uid)']),
        },
      },
    },
  },
})

const expected = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return getCurrentAuthUser().data.isAdmin == true;
    }

    function isUserScope(uid) {
      return request.auth.uid == uid;
    }

    match /versions/{version} {
      function __validator_0__(data) {
        return true;
      }

      match /users/{uid} {
        function __validator_1__(data) {
          return (data.name is string && (data.displayName is string || data.displayName is null) && data.age is int);
        }

        allow read: if true;
        allow write: if (isUserScope(uid) && __validator_1__(request.resource.data));

        match /posts/{postId} {
          function __validator_2__(data) {
            return ((data.type is string && data.text is string) || (data.type is string && data.texts is list));
          }

          allow read: if true;
          allow write: if (isUserScope(uid) && __validator_2__(request.resource.data));
        }

        match /privatePosts/{postId} {
          function __validator_3__(data) {
            return (data.type is string && data.text is string);
          }

          allow read: if (isAdmin() || isUserScope(uid));
          allow write: if (isUserScope(uid) && __validator_3__(request.resource.data));
        }
      }
    }
  }
}`.trim()

test('render', () => {
  expect(schema.rendered).toBe(expected)
})
// console.log(schema.rendered)
