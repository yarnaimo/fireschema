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

- **TypeScript** (>= 4.4)

<br />

## Install

```sh
yarn add fireschema firebase firebase-admin firebase-functions zod
yarn add -D typescript ts-node
```

<br />

## Setup

> 🎉 Since Fireschema v5, you no longer need to compile codes via custom transformer.

<br />

## Usage - Firestore

### Schema Transformation

| Zod Schema                           | Security Rules Output                                                  |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `z.any()`                            | `true`                                                                 |
| `z.unknown()`                        | `true`                                                                 |
| `z.undefined()`                      | `!("key" in data)`                                                     |
| `z.null()`                           | `data.key == null`                                                     |
| `z.boolean()`                        | `data.key is bool`                                                     |
| `z.literal('a')`                     | `data.key == "a"`                                                      |
| `z.string()`                         | `data.key is string`                                                   |
| `z.string().min(5)`                  | `(data.key is string && data.key.size >= 5)`                           |
| `z.string().min(5).max(20)`          | `(data.key is string && data.key.size >= 5 && data.key.size <= 20)`    |
| `z.string().regex(/@example\.com$/)` | `(data.key is string && data.key.matches("@example\\.com$"))`          |
| `z.number()`                         | `data.key is number`                                                   |
| `z.number().int()`                   | `data.key is int`                                                      |
| `z.number().min(5)`                  | `(data.key is int && data.key >= 5)`                                   |
| `z.number().max(20)`                 | `(data.key is int && data.key <= 20)`                                  |
| `timestampType()`                    | `data.key is timestamp`                                                |
| `z.tuple([z.string(), z.number()])`  | `(data.key is list && data.key[0] is string && data.key[1] is number)` |
| `z.string().array()`                 | `data.key is list`                                                     |
| `z.string().array().min(5)`          | `(data.key is list && data.key.size() >= 5)`                           |
| `z.string().array().max(20)`         | `(data.key is list && data.key.size() <= 20)`                          |
| `z.string().optional()`              | `(data.key is string \|\| !("key" in data))`                           |
| `z.union([z.string(), z.null()])`    | `(data.key is string \|\| data.key == null)`                           |

<br>

### 1. Define schema

The schema definition must be default exported.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-1-schema.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-1-schema.ts -->

```ts
import { Merge } from 'type-fest'
import { z } from 'zod'

import { DataModel, FirestoreModel, rules, timestampType } from 'fireschema'

export const UserType = z.object({
  name: z.string(),
  displayName: z.union([z.string(), z.null()]),
  age: z.number().int(),
  timestamp: timestampType(),
  options: z.object({ a: z.boolean() }).optional(),
})

type User = z.infer<typeof UserType>
/* => {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options?: { a: boolean } | undefined
} */

type UserDecoded = Merge<User, { timestamp: Date }>

const UserModel = new DataModel({
  schema: UserType,
  decoder: (data: User): UserDecoded => ({
    ...data,
    timestamp: data.timestamp.toDate(),
  }),
})

const PostType = z.object({
  authorUid: z.string(),
  text: z.string(),
  tags: z.object({ id: z.number().int(), name: z.string() }).array(),
})

const PostModel = new DataModel({
  schema: PostType,
  selectors: (q) => ({
    byTag: (tag: string) => [
      q.where('tags', 'array-contains', tag),
      q.limit(20),
    ],
  }),
})

export const firestoreModel = new FirestoreModel({
  'function isAdmin()': `
    return exists(${rules.basePath}/admins/$(request.auth.uid));
  `,

  'function requestUserIs(uid)': `
    return request.auth.uid == uid;
  `,

  collectionGroups: {
    '/posts/{postId}': {
      allow: {
        read: true,
      },
    },
  },

  '/users/{uid}': {
    model: UserModel,
    allow: {
      read: true, // open access
      write: rules.or('requestUserIs(uid)', 'isAdmin()'),
    },

    '/posts/{postId}': {
      'function authorUidMatches()': `
        return request.resource.data.authorUid == uid;
      `,

      model: PostModel,
      allow: {
        read: true,
        write: rules.and('requestUserIs(uid)', 'authorUidMatches()'),
      },
    },
  },
})

export default firestoreModel
```

<!-- AUTO-GENERATED-CONTENT:END -->

<br>

### 2. Generate firestore.rules

```sh
yarn fireschema rules <path-to-schema>.ts
```

> Environment variable `TS_NODE_PROJECT` is supported.

<details>
  <summary>Example of generated firestore.rules</summary>

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./firestore.rules) -->
<!-- The below code snippet is automatically added from ./firestore.rules -->

```rules
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

    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function requestUserIs(uid) {
      return request.auth.uid == uid;
    }

    match /{path=**}/posts/{postId} {
      allow read: if true;
    }

    match /users/{uid} {
      function __validator_0__(data) {
        return (__validator_meta__(data) && (
          __validator_keys__(data, ['name', 'displayName', 'age', 'timestamp', 'options'])
            && data.name is string
            && (data.displayName is string || data.displayName == null)
            && data.age is int
            && data.timestamp is timestamp
            && (data.options.a is bool || !("options" in data))
        ));
      }

      allow read: if true;
      allow write: if ((requestUserIs(uid) || isAdmin()) && __validator_0__(request.resource.data));

      match /posts/{postId} {
        function authorUidMatches() {
          return request.resource.data.authorUid == uid;
        }

        function __validator_1__(data) {
          return (__validator_meta__(data) && (
            __validator_keys__(data, ['authorUid', 'text', 'tags'])
              && data.authorUid is string
              && data.text is string
              && data.tags is list
          ));
        }

        allow read: if true;
        allow write: if ((requestUserIs(uid) && authorUidMatches()) && __validator_1__(request.resource.data));
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

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-3-typed-firestore.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-3-typed-firestore.ts -->

```ts
import { initializeApp } from 'firebase/app' // or firebase-admin
import { initializeFirestore } from 'firebase/firestore'

import { TypedFirestoreWeb } from 'fireschema'
import { firestoreModel } from './1-1-schema.js'

const app = initializeApp({
  // ...
})
const firestoreApp = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})

/**
 * Initialize TypedFirestore
 */
export const typedFirestore: TypedFirestoreWeb<typeof firestoreModel> =
  new TypedFirestoreWeb(firestoreModel, firestoreApp)

/**
 * Reference collections/documents and get snapshot
 */
const usersRef = typedFirestore.collection('users') // TypedCollectionRef instance
const userRef = usersRef.doc('userId') // TypedDocumentRef instance

const postsRef = userRef.collection('posts')
const postRef = postsRef.doc('123')
const techPostsQuery = postsRef.select.byTag('tech') // selector defined in schema

await userRef.get() // DocumentSnapshot<User>
await userRef.getData() // User

await postRef.get() // DocumentSnapshot<PostA | PostB>
await postsRef.get() // QuerySnapshot<PostA | PostB>
await postsRef.getData() // (PostA | PostB)[]
await techPostsQuery.get() // QuerySnapshot<PostA | PostB>

/**
 * Get child collection of retrived document snapshot
 */
const snap = await usersRef.get()
const firstUserRef = snap.typedDocs[0]!.typedRef

await firstUserRef.collection('posts').get()

/**
 * Reference parent collection/document
 */
const _postsRef = postRef.parentCollection()
const _userRef = postsRef.parentDocument()

/**
 * Reference collections groups and get snapshot
 */
const postsGroup = typedFirestore.collectionGroup('posts')
const techPostsGroup = postsGroup.select.byTag('tech')

await postsGroup.get() // QuerySnapshot<PostA | PostB>
await techPostsGroup.get() // QuerySnapshot<PostA | PostB>

/**
 * Write data
 */
await userRef.create(({ serverTimestamp }) => ({
  name: 'test',
  displayName: 'Test',
  age: 20,
  timestamp: serverTimestamp(),
  options: { a: true },
}))
await userRef.setMerge({
  age: 21,
})
await userRef.update({
  age: 21,
})
await userRef.delete()

/**
 * Transaction
 */
await typedFirestore.runTransaction(async (tt) => {
  const snap = await tt.get(userRef)
  tt.update(userRef, {
    age: snap.data()!.age + 1,
  })
})
```

<!-- AUTO-GENERATED-CONTENT:END -->

<br>

### 4. React Hooks

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-4-react-hooks.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/1-4-react-hooks.tsx -->

```tsx
import React from 'react'

import { useTypedDocument, useTypedQuery } from 'fireschema/hooks'
import { typedFirestore } from './1-3-typed-firestore.js'

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

## Usage - Cloud Functions

### 1. Create functions

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-1-typed-functions.ts) -->
<!-- The below code snippet is automatically added from ./src/example/2-1-typed-functions.ts -->

```ts
import * as functions from 'firebase-functions'
import { z } from 'zod'

import { TypedFunctions } from 'fireschema/admin'
import { UserType, firestoreModel } from './1-1-schema.js'

/**
 * Initialize TypedFunctions
 */
const timezone = 'Asia/Tokyo'
const typedFunctions = new TypedFunctions(firestoreModel, timezone)
const builder = functions.region('asia-northeast1')

/**
 * functions/index.ts file
 */
export const UserJsonType = UserType.extend({ timestamp: z.string() })
export const callable = {
  createUser: typedFunctions.callable({
    schema: {
      input: UserJsonType, // schema of request data (automatically validate on request)
      output: z.object({ result: z.boolean() }), // schema of response data
    },
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
    schema: z.object({ text: z.string() }),
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

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-2-callable-function.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/2-2-callable-function.tsx -->

```tsx
import { initializeApp } from 'firebase/app'
import { getFunctions } from 'firebase/functions'
import React from 'react'

import { TypedCaller } from 'fireschema'

type FunctionsModule = typeof import('./2-1-typed-functions.js')

const app = initializeApp({
  // ...
})
const functionsApp = getFunctions(app, 'asia-northeast1')

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

    if (result.error) {
      console.error(result.error)
      return
    }
    console.log(result.data)
  }

  return <button onClick={createUser} />
}
```

<!-- AUTO-GENERATED-CONTENT:END -->
