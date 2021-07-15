import { renderSchema } from '../../core/firestore/_renderer/root'
import { firestoreModel } from '../_fixtures/firestore-schema'

const expected = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function __validator_meta__(data) {
      return (
        (request.method != "create" || (!("_createdAt" in data) || data._createdAt == request.time))
          && (!("_updatedAt" in data) || data._updatedAt == request.time)
      );
    }

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
            __validator_meta__(data)
              && data.name is string
              && (data.displayName is string || data.displayName == null)
              && data.age is int
              && (data.tags.size() == 0 || (data.tags[0].id is int && data.tags[0].name is string))
              && data.timestamp is timestamp
              && ((data.options.a is bool && data.options.b is string) || !("options" in data))
          );
        }

        allow read: if true;
        allow write: if (isUserScope(uid) && __validator_0__(request.resource.data));
        allow delete: if isUserScope(uid);

        match /posts/{postId} {
          function __validator_1__(data) {
            return ((
              __validator_meta__(data)
                && data.type == "a"
                && data.text is string
            ) || (
              __validator_meta__(data)
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
              __validator_meta__(data)
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
  const result = renderSchema(firestoreModel)
  expect(result).toBe(expected)
})
