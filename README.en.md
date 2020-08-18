# Fireschema

> Translated by [**DeepL**](https://www.deepl.com)

A library that automatically generates rules and types documents from objects that define Firestore collection structures, schemas, and access controls.

## Requirements

- **TypeScript** (>= 4.0)

## Install

```sh
yarn add fireschema
yarn add -D typescript@^4.0.0-beta ts-node
```

## Setup

### Custom Compiler / Transformer

Fireschema uses **Custom Transformer** to retrieve type information from TypeScript ASTs, so you will need to use a Custom Compiler **ttypescript** to build it.

To use Custom Compiler / Transformer, you must add the following to your configuration file:

**package.json**

`ttsc` / `ts-node` allows you to specify an arbitrary `tsconfig.json` with the environment variable `TS_NODE_PROJECT`.

```json
{
  "scripts": {
    "build": "ttsc", // <- tsc
    "ts-node": "ts-node --compiler ttypescript" // <- ts-node
  }
}
```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "fireschema/transformer"
      }
    ]
  }
}
```

**jest.config.js**

```js
module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      compiler: 'ttypescript',
    },
  },
}
```

### Override Dependencies

Some packages on which fireschema depends depend on **TypeScript 3.9**, so you need to **override** the dependency with selective dependency resolutions. (Only yarn is supported.)

```json
{
  "resolutions": {
    "fireschema/**/typescript": "^4.0.0-beta"
  }
}
```

## Usage

**Note**

- **Do not use the following variable names except for importing from fireschema**, as fireschema translates the code according to the variable names.
  - **`$documentSchema`**
  - **`$collectionAdapter`**
  - **`__$__`**

**Case**

- /users/{uid}
  - Users (`User`)
- /users/{uid}/posts/{postId}
  - Posts of User (`PostA` or `PostB`)

### 1. Collection structure and schema definition

The schema definition should be named exported as **firestoreSchema`**.

```ts
import {
  $adapter,
  $allow,
  $collectionGroups,
  $docLabel,
  $documentSchema,
  $functions,
  $or,
  $schema,
  $collectionAdapter,
  createFirestoreSchema,
  FTypes,
} from '..'

// user
type User = {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options: { a: boolean }
}
const UserSchema = $documentSchema<User>()
const UserAdapter = $collectionAdapter<User>()({})

// post
type PostA = {
  type: 'a'
  tags: { id: number; name: string }[]
  text: string
}
type PostB = {
  type: 'b'
  tags: { id: number; name: string }[]
  texts: string[]
}
const PostSchema = $documentSchema<PostA | PostB>()
const PostAdapter = $collectionAdapter<PostA | PostB>()({
  selectors: (q) => ({
    byTag: (tag: string) => q.where('tags', 'array-contains', tag),
  }),
})

export const firestoreSchema = createFirestoreSchema({
  [$functions]: {
    // Whether /admins/<uid> exists or not
    ['isAdmin()']: `
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    `,

    // Whether the uid of the user you are trying to access matches the {uid}.
    ['matchesUser(uid)']: `
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

  // /users/{uid}
  users: {
    [$docLabel]: 'uid', // The {uid} part
    [$schema]: UserSchema, // documentSchema
    [$adapter]: UserAdapter, // collectionAdapter
    [$allow]: {
      // Access control
      read: true, // Anyone
      write: $or(['matchesUser(uid)', 'isAdmin()']), // Only users matching the {uid} or administrators
    },

    // /users/{uid}/posts/{postId}
    posts: {
      [$docLabel]: 'postId',
      [$schema]: PostSchema,
      [$adapter]: PostAdapter,
      [$allow]: {
        read: true,
        write: $or(['matchesUser(uid)']), // Only users matching the {uid}
      },
    },
  },
})
```

### 2. Generate firestore.rules

```sh
yarn fireschema <schema_path>.ts
```

As with `ttsc` / `ts-node`, it allows you to specify an arbitrary `tsconfig.json` with the environment variable `TS_NODE_PROJECT`.

<details>
  <summary>Example of generated firestore.rules</summary>

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function matchesUser(uid) {
      return request.auth.uid == uid;
    }

    match /{path=**}/users/{uid} {
      allow read: if true;
    }

    match /users/{uid} {
      function __validator_0__(data) {
        return (
          data.name is string
            && ((data.displayName == null || !(displayName in data)) || data.displayName is string)
            && (data.age is int || data.age is float)
            && data.timestamp is timestamp
            && data.options.a is bool
        );
      }

      allow read: if true;
      allow write: if ((matchesUser(uid) || isAdmin()) && __validator_0__(request.resource.data));

      match /posts/{postId} {
        function __validator_1__(data) {
          return ((
            data.type == "a"
              && (data.tags.size() == 0 || ((data.tags[0].id is int || data.tags[0].id is float) && data.tags[0].name is string))
              && data.text is string
          ) || (
            data.type == "b"
              && (data.tags.size() == 0 || ((data.tags[0].id is int || data.tags[0].id is float) && data.tags[0].name is string))
              && (data.texts.size() == 0 || data.texts[0] is string)
          ));
        }

        allow read: if true;
        allow write: if (matchesUser(uid) && __validator_1__(request.resource.data));
      }
    }
  }
}
```

</details>

### 3. Working with Collections and Documents

#### Initialize Controller

```ts
import firebase, { firestore, initializeApp } from 'firebase' // or firebase-admin
import { firestoreSchema } from '<schema_path>'

const app: firebase.app.App = initializeApp({
  // ...
})
const firestoreApp = app.firestore()

const $store: FirestoreController<
  typeof firestoreApp,
  typeof schema
> = initFirestore(firestore, firestoreApp, firestoreSchema)
```

#### Collections

```ts
const users = $store.collection('root', 'users') // /users
const user = users.ref.doc('userId') // /users/userId

const posts = $store.collection(user, 'posts') // /users/userId/posts
const post = posts.ref.doc('123') // /users/userId/posts/123

const postSnapshot = await post.get() // DocumentSnapshot<PostA | PostB>

const postsSnapshot = await posts.ref.get() // get collection
const techPostsSnapshot = await posts.select.byTag('tech').get() // get query
```

Get the collection's parent document

```ts
const user = $store.parentOfCollection(posts.ref) // DocumentReference<User>
```

#### Collection groups

```ts
const postsGroup = $store.collectionGroup(['users', 'posts'])
const techPostsSnapshot = await postsGroup.select.byTag('tech').get()
```

#### Creating and updating documents

- `create(docRef: DocumentReference<T>, data: T)`
- `setMerge(docRef: DocumentReference<T>, data: Partial<T>)`
- `update(docRef: DocumentReference<T>, data: Partial<T>)`
- `delete(docRef: DocumentReference<T>)`

```ts
await $store.create(user, {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: $store.FieldValue.serverTimestamp(),
}
```

**Transactions**

- `get(docRef: DocumentReference<T>) => Promise<DocumentSnapshot<T>>`
- `create(docRef: DocumentReference<T>, data: T)`
- `setMerge(docRef: DocumentReference<T>, data: Partial<T>)`
- `update(docRef: DocumentReference<T>, data: Partial<T>)`
- `delete(docRef: DocumentReference<T>)`

```ts
await $store.runTransaction(async (tc) => {
  const snapshot = await tc.get(user)
  tc.setMerge(user, {
    age: snapshot.data()!.age + 1,
  })
})
```
