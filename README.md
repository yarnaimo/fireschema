<br />

![Fireschema](./logo.png)

<p align="center">Strongly typed Firestore framework for TypeScript</p>

<br />

## Features

- **Strong type safety for Firestore** - Automatically provide type information to _nested documents_ without unsafe type assertions, from the simple schema. Also support data decoding.
- **Security rules generation** - Generate firestore.rules file including data type validation and access control from the schema.
- **React Hooks** - Get realtime updates with React Hooks.
- **Type safety for Cloud Functions**
  - Automatically provide type information to snapshot data on Firestore Trigger Function based on the path string.
  - Guard HTTPS callable function's request/response data type _both on compile time and runtime_.

<br />

## Requirement

- **TypeScript** (>= 4.2)

<br />

## Install

```sh
yarn add fireschema
yarn add -D typescript ts-node
```

<br />

## Setup

### Custom Transformer

To generate Firestore security rules or embedding type validation code into Callable Function, you need to compile codes via **Fireschema's custom transformer** that retrives type information from TypeScript AST.

Currently official TypeScript package doesn't support custom transformers, and you need to use **[ttypescript](https://github.com/cevek/ttypescript)** that wraps TypeScript compiler.

Add following options to your **`tsconfig.json`**,

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

and replace the commands.

|            | before    | after                                  |
| ---------- | --------- | -------------------------------------- |
| typescript | `tsc`     | `ttsc` (ttypescript's compile command) |
| ts-node    | `ts-node` | `ts-node --compiler ttypescript`       |

> `ttsc` and `ts-node` supports specifying `tsconfig.json` by using environment variable `TS_NODE_PROJECT`.

If you use ts-jest, add following options to jest config.

```js
module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      compiler: 'ttypescript',
    },
  },
}
```

<br>

---

<br>

## Example - Firestore

> **Do not use following variable names except importing from fireschema**.
>
> - `$collectionSchema`
> - `__$__`

#### Data structure of examples

- `users/{uid}` - `User`
- `users/{uid}/posts/{postId}` - `PostA | PostB`

<br>

### 1. Define schema

The schema definition must be named exported as **`firestoreSchema`**.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-1-schema.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-1-schema.ts -->

```ts
import { Merge } from 'type-fest'
import {
  $allow,
  $collectionGroups,
  $collectionSchema,
  $docLabel,
  $functions,
  $or,
  $schema,
  createFirestoreSchema,
  FTypes,
} from 'fireschema'

// user
export type User = {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options: { a: boolean }
}
export type UserDecoded = Merge<User, { timestamp: Date }>

const UserSchema = $collectionSchema<User, UserDecoded>()({
  decoder: (data) => ({
    ...data,
    timestamp: data.timestamp.toDate(),
  }),
})

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
const PostSchema = $collectionSchema<PostA | PostB>()({
  selectors: (q) => ({
    byTag: (tag: string) => q.where('tags', 'array-contains', tag),
  }),
})

export const firestoreSchema = createFirestoreSchema({
  [$functions]: {
    // whether /admins/<uid> exists
    ['isAdmin()']: `
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    `,

    // whether uid matches
    ['matchesUser(uid)']: `
      return request.auth.uid == uid;
    `,
  },

  [$collectionGroups]: {
    posts: {
      [$docLabel]: 'postId',
      [$schema]: PostSchema,
      [$allow]: {
        read: true,
      },
    },
  },

  // /users/{uid}
  users: {
    [$docLabel]: 'uid', // {uid}
    [$schema]: UserSchema, // collectionSchema
    [$allow]: {
      // access control
      read: true, // all user
      write: $or(['matchesUser(uid)', 'isAdmin()']), // only users matching {uid} or admins
    },

    // /users/{uid}/posts/{postId}
    posts: {
      [$docLabel]: 'postId',
      [$schema]: PostSchema,
      [$allow]: {
        read: true,
        write: 'matchesUser(uid)',
      },
    },
  },
})
```

<!-- AUTO-GENERATED-CONTENT:END -->

<br>

### 2. Generate firestore.rules

```sh
yarn fireschema <path-to-schema>.ts
```

> Environment variable `TS_NODE_PROJECT` is supported similarly to `ttsc` and `ts-node`.

<details>
  <summary>Example of generated firestore.rules</summary>

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./firestore.rules) -->
<!-- The below code snippet is automatically added from ./firestore.rules -->

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
            && ((data.displayName == null || !("displayName" in data)) || data.displayName is string)
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

<!-- AUTO-GENERATED-CONTENT:END -->

</details>

<br>

### 3. Read/write collections and documents

The Firestore interface of Fireschema supports both **Web SDK and Admin SDK**.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-3-adapter.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-3-adapter.ts -->

```ts
import firebase from 'firebase/app' // or firebase-admin
import { TypedFirestore } from 'fireschema/core'
import { firestoreSchema } from './1-1-schema'

const app: firebase.app.App = firebase.initializeApp({
  // ...
})
const firestoreApp = app.firestore()
firestoreApp.settings({ ignoreUndefinedProperties: true })

/**
 * Initialize TypedFirestore
 */
export const typedFirestore: TypedFirestore<
  typeof firestoreSchema,
  firebase.firestore.Firestore
> = new TypedFirestore(firestoreSchema, firebase.firestore, firestoreApp)

/**
 * Reference collections/documents and get snapshot
 */
const users = typedFirestore.collection('users') // TypedCollectionRef instance
const user = users.doc('userId') // TypedDocumentRef instance

const posts = user.collection('posts')
const post = posts.doc('123')
const techPosts = user.collectionQuery(
  'posts',
  (q) => q.byTag('tech'), // selector defined in schema
)

!(async () => {
  await user.get() // DocumentSnapshot<User>

  await post.get() // DocumentSnapshot<PostA | PostB>
  await posts.get() // QuerySnapshot<PostA | PostB>
  await techPosts.get() // QuerySnapshot<PostA | PostB>
})

/**
 * Get child collection of retrived document snapshot
 */
!(async () => {
  const snap = await users.get()
  const firstUserRef = snap.docs[0]!.ref

  await typedFirestore.wrapDocument(firstUserRef).collection('posts').get()
})

/**
 * Reference parent collection/document
 */
const _posts = post.parentCollection()
const _user = posts.parentDocument()

/**
 * Reference collections groups and get snapshot
 */
const postsGroup = typedFirestore.collectionGroup(
  'posts', // collection name: passed to original collectionGroup method
  'users.posts', // to get schema options
)
const techPostsGroup = typedFirestore.collectionGroupQuery(
  'posts',
  'users.posts',
  (q) => q.byTag('tech'),
)

!(async () => {
  await postsGroup.get() // QuerySnapshot<PostA | PostB>
  await techPostsGroup.get() // QuerySnapshot<PostA | PostB>
})

/**
 * Write data
 */
!(async () => {
  await user.create({
    name: 'test',
    displayName: 'Test',
    age: 20,
    timestamp: typedFirestore.firestoreStatic.FieldValue.serverTimestamp(),
    options: { a: true },
  })
  await user.setMerge({
    age: 21,
  })
  await user.update({
    age: 21,
  })
  await user.delete()
})

/**
 * Transaction
 */
!(async () => {
  await typedFirestore.runTransaction(async (tt) => {
    const snap = await tt.get(user)
    tt.update(user, {
      age: snap.data()!.age + 1,
    })
  })
})
```

<!-- AUTO-GENERATED-CONTENT:END -->

<br>

### 4. Hooks

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-4-hooks.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/1-4-hooks.tsx -->

```tsx
import React from 'react'
import { useTypedDocument, useTypedQuery } from 'fireschema/hooks'
import { typedFirestore } from './1-3-adapter'

/**
 * Get realtime updates of collection/query
 */
export const UsersComponent = () => {
  const users = useTypedQuery(typedFirestore.collection('users'))
  if (!users.data) {
    return <span>{'Loading...'}</span>
  }

  return (
    <ul>
      {users.data.map((user, i) => (
        <li key={i}>{user.displayName}</li>
      ))}
    </ul>
  )
}

/**
 * Get realtime updates of document
 */
export const UserComponent = ({ id }: { id: string }) => {
  const user = useTypedDocument(typedFirestore.collection('users').doc(id))
  if (!user.data) {
    return <span>{'Loading...'}</span>
  }

  return <span>{user.data.displayName}</span>
}
```

<!-- AUTO-GENERATED-CONTENT:END -->

<br>

---

<br>

## Example - Functions

### 1. Create functions

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-1-registerer.ts) -->
<!-- The below code snippet is automatically added from ./src/example/2-1-registerer.ts -->

```ts
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Merge } from 'type-fest'
import { $jsonSchema, TypedFunctions } from 'fireschema'
import { firestoreSchema, User } from './1-1-schema'

/**
 * Initialize TypedFunctions
 */
const timezone = 'Asia/Tokyo'
const typedFunctions = new TypedFunctions(
  firestoreSchema,
  firestore,
  functions,
  timezone,
)
const builder = functions.region('asia-northeast1')

/**
 * functions/index.ts file
 */
export type UserJson = Merge<User, { timestamp: string }>
export const callable = {
  createUser: typedFunctions.callable({
    schema: [
      $jsonSchema<UserJson>(), // schema of request data (automatically validate on request)
      $jsonSchema<{ result: boolean }>(), // schema of response data
    ],
    builder,
    handler: async (data, context) => {
      console.log(data) // UserJson

      return { result: true }
    },
  }),
}

export const firestoreTrigger = {
  onUserCreate: typedFunctions.firestoreTrigger.onCreate({
    builder,
    path: 'users/{uid}',
    handler: async (decodedData, snap, context) => {
      console.log(decodedData) // UserDecoded (provided based on path string)
      console.log(snap) // QueryDocumentSnapshot<User>
    },
  }),
}

export const http = {
  getKeys: typedFunctions.http({
    builder,
    handler: (req, resp) => {
      if (req.method !== 'POST') {
        resp.status(400).send()
        return
      }
      resp.json(Object.keys(req.body))
    },
  }),
}

export const topic = {
  publishMessage: typedFunctions.topic('publish_message', {
    schema: $jsonSchema<{ text: string }>(),
    builder,
    handler: async (data) => {
      data // { text: string }
    },
  }),
}

export const schedule = {
  cron: typedFunctions.schedule({
    builder,
    schedule: '0 0 * * *',
    handler: async (context) => {
      console.log(context.timestamp)
    },
  }),
}
```

<!-- AUTO-GENERATED-CONTENT:END -->

<br>

### 2. Call HTTPS callable function

Automatically provide types to request/response data based on passed functions module type.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-2-callable.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/2-2-callable.tsx -->

```tsx
import firebase from 'firebase/app'
import React from 'react'
import { TypedCaller } from 'fireschema'

type FunctionsModule = typeof import('./2-1-registerer')

const app: firebase.app.App = firebase.initializeApp({
  // ...
})
const functionsApp = app.functions('asia-northeast1')

export const typedCaller = new TypedCaller<FunctionsModule>(functionsApp)

const Component = () => {
  const createUser = async () => {
    const result = await typedCaller.call('createUser', {
      name: 'test',
      displayName: 'Test',
      age: 20,
      timestamp: new Date().toISOString(),
      options: { a: true },
    })

    if (!result.isOk) {
      console.error(result.error)
      return
    }
    console.log(result.value)
  }

  return <button onClick={createUser}></button>
}
```

<!-- AUTO-GENERATED-CONTENT:END -->
