import { renderSchema } from '../../core/firestore/_renderer/root'
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
          return (
            (!("_createdAt" in data) || data._createdAt == request.time)
              && (!("_updatedAt" in data) || data._updatedAt == request.time)
              && data.name is string
              && (data.displayName == null || data.displayName is string)
              && (data.age is int || data.age is float)
              && (data.tags.size() == 0 || ((data.tags[0].id is int || data.tags[0].id is float) && data.tags[0].name is string))
              && data.timestamp is timestamp
              && (!("options" in data) || (data.options.a is bool && data.options.b is string))
          );
        }

        allow read: if true;
        allow write: if (isUserScope(uid) && __validator_0__(request.resource.data));
        allow delete: if isUserScope(uid);

        match /posts/{postId} {
          function __validator_1__(data) {
            return ((
              (!("_createdAt" in data) || data._createdAt == request.time)
                && (!("_updatedAt" in data) || data._updatedAt == request.time)
                && data.type == "a"
                && data.text is string
            ) || (
              (!("_createdAt" in data) || data._createdAt == request.time)
                && (!("_updatedAt" in data) || data._updatedAt == request.time)
                && data.type == "b"
                && (data.texts.size() == 0 || data.texts[0] is string)
            ));
          }

          allow read: if true;
          allow write: if (isUserScope(uid) && __validator_1__(request.resource.data));
          allow delete: if isUserScope(uid);
        }

        match /privatePosts/{postId} {
          function __validator_2__(data) {
            return (
              (!("_createdAt" in data) || data._createdAt == request.time)
                && (!("_updatedAt" in data) || data._updatedAt == request.time)
                && data.type == "a"
                && data.text is string
            );
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
