import { renderSchema } from '../../firestore/_renderers/root'
import { firestoreSchema } from '../_fixtures/firestore-schema'

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

    match /{path=**}/users/{uid} {
      allow read: if true;
    }

    match /versions/{version} {
      match /users/{uid} {
        function __validator_0__(data) {
          return (data.name is string && (data.displayName is string || data.displayName == null || !(displayName in data)) && data.age is int && (data.tags.size() == 0 || (data.tags[0].id is int && data.tags[0].name is string)) && data.timestamp is timestamp && (data.options.a is bool && data.options.b is string));
        }

        allow read: if true;
        allow write: if (isUserScope(uid) && __validator_0__(request.resource.data));

        match /posts/{postId} {
          function __validator_1__(data) {
            return ((data.type is string && data.text is string) || (data.type is string && (data.texts.size() == 0 || data.texts[0] is string)));
          }

          allow read: if true;
          allow write: if (isUserScope(uid) && __validator_1__(request.resource.data));
        }

        match /privatePosts/{postId} {
          function __validator_2__(data) {
            return (data.type is string && data.text is string);
          }

          allow read: if (isAdmin() || isUserScope(uid));
          allow write: if (isUserScope(uid) && __validator_2__(request.resource.data));
        }
      }
    }
  }
}`.trim()

test('render', () => {
  const result = renderSchema(firestoreSchema)
  expect(result).toBe(expected)
})
