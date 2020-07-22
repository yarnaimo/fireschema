import { dataSchema, fireschema } from '../fireschema'
import { $allow, $docLabel, $functions, $or, $schema } from '../utils'

const VersionSchema = dataSchema<{}>({})

type ITest1 = {
  name: string
  displayName: string | null
  age: number
}

const Test1Schema = dataSchema<ITest1>({
  name: 'string',
  displayName: 'string | null',
  age: 'int',
})

type ITest2A = {
  type: 'a'
  text: string
}

const Test2ASchema = dataSchema<ITest2A>({
  type: 'string',
  text: 'string',
})

type ITest2B = {
  type: 'b'
  texts: number[]
}

const Test2BSchema = dataSchema<ITest2B>({
  type: 'string',
  texts: 'list',
})

const getCurrentAuthUser = () => `getCurrentAuthUser()`
const isAdmin = () => `isAdmin()`
const isUserScope = (arg: string) => `isUserScope(${arg})`

const schema = fireschema({
  [$functions]: {
    [getCurrentAuthUser()]: `
      return get(/databases/$(database)/documents/authUsers/$(request.auth.uid));
    `,
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

    test1s: {
      [$schema]: Test1Schema,
      [$docLabel]: 'uid',
      [$allow]: {
        read: $or([isAdmin(), isUserScope('uid')]),
      },

      test2s: {
        [$schema]: [Test2ASchema, Test2BSchema],
        [$docLabel]: 'test2Id',
        [$allow]: {
          read: $or([isAdmin(), isUserScope('uid')]),
          write: $or([isAdmin()]),
        },
      },
    },
  },
})

const expected = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function getCurrentAuthUser() {
      return get(/databases/$(database)/documents/authUsers/$(request.auth.uid));
    }

    function isAdmin() {
      return getCurrentAuthUser().data.isAdmin == true;
    }

    function isUserScope(uid) {
      return request.auth.uid == uid;
    }

    match /versions/{version} {
      function __validator_0__(data) {
        return (true);
      }

      match /test1s/{uid} {
        function __validator_1__(data) {
          return (((data.name is string) && (data.displayName is string || data.displayName is null) && (data.age is int)));
        }

        allow read: if (isAdmin() || isUserScope(uid));

        match /test2s/{test2Id} {
          function __validator_2__(data) {
            return (((data.type is string) && (data.text is string)) || ((data.type is string) && (data.texts is list)));
          }

          allow read: if (isAdmin() || isUserScope(uid));
          allow write: if ((isAdmin()) && __validator_2__(request.resource.data));
        }
      }
    }
  }
}`.trim()

test('render', () => {
  expect(schema.rendered).toBe(expected)
})
// console.log(schema.rendered)
