import { firestore } from 'firebase-admin'
import { initFirestore } from '..'
import { dbAdmin } from './firestore'
import { schema } from './fixtures/schema'

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

describe('types', () => {
  test('', () => {})
})

const storeAdmin = initFirestore(firestore, dbAdmin, schema.schema)

const versions = storeAdmin('root', 'versions')
const v1 = versions.ref.doc('v1')

const users = storeAdmin(v1, 'users')
const user = users.ref.doc('user')

const posts = storeAdmin(user, 'posts')
const post = posts.ref.doc('post')
post.get().then((a) => a.data())
