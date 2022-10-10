"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root_js_1 = require("../../core/firestore/_renderer/root.js");
const firestore_schema_js_1 = require("../_fixtures/firestore-schema.js");
const expected = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function __validator_meta__(data) {
      return (
        (request.method == "create" && data._createdAt == request.time && data._updatedAt == request.time)
          || (request.method == "update" && data._createdAt == resource.data._createdAt && data._updatedAt == request.time)
      );
    }

    function __validator_keys__(data, keys) {
      return data.keys().removeAll(['_createdAt', '_updatedAt']).hasOnly(keys);
    }

    function getCurrentAuthUserDoc() {
      return get(/databases/$(database)/documents/authUsers/$(request.auth.uid));
    }

    function isAdmin() {
      return getCurrentAuthUserDoc().data.isAdmin == true;
    }

    function requestUserIs(uid) {
      return request.auth.uid == uid;
    }

    match /{path=**}/users/{uid} {
      allow read: if true;
    }

    match /versions/{version} {
      match /users/{uid} {
        function __validator_0__(data) {
          return (__validator_meta__(data) && (
            __validator_keys__(data, ['name', 'displayName', 'age', 'tags', 'timestamp', 'options'])
              && data.name is string
              && (data.displayName is string || data.displayName == null)
              && data.age is int
              && data.tags is list
              && data.timestamp is timestamp
              && ((data.options.a is bool && data.options.b is string) || !("options" in data))
          ));
        }

        allow read: if true;
        allow write: if (requestUserIs(uid) && __validator_0__(request.resource.data));
        allow delete: if requestUserIs(uid);

        match /posts/{postId} {
          function test() {
            return true;
          }

          function __validator_1__(data) {
            return (__validator_meta__(data) && ((
              __validator_keys__(data, ['type', 'text'])
                && data.type == "a"
                && data.text is string
            ) || (
              __validator_keys__(data, ['type', 'texts'])
                && data.type == "b"
                && data.texts is list
            )));
          }

          allow read: if true;
          allow write: if (requestUserIs(uid) && __validator_1__(request.resource.data));
          allow delete: if requestUserIs(uid);
        }

        match /privatePosts/{postId} {
          function __validator_2__(data) {
            return (__validator_meta__(data) && (
              __validator_keys__(data, ['type', 'text'])
                && data.type == "a"
                && data.text is string
            ));
          }

          allow read: if (isAdmin() || requestUserIs(uid));
          allow write: if (requestUserIs(uid) && __validator_2__(request.resource.data));
        }
      }
    }
  }
}`.trim();
test('render', () => {
    const result = (0, root_js_1.renderSchema)(firestore_schema_js_1.firestoreModel);
    expect(result).toBe(expected);
});
