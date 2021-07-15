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

- **TypeScript** (>= 4.3)

<br />

## Install

```sh
yarn add fireschema
yarn add -D typescript ts-node
```

<br />

## Setup

> 🎉 Since Fireschema v5, you no longer need to compile codes via custom transformer.

<br />

## Example - Firestore

#### Data structure of examples

- `users/{uid}` - `User`
- `users/{uid}/posts/{postId}` - `Post`

<br>

### 1. Define schema

The schema definition must be default exported.

```txt
SchemaType  ->  DataModel  ->  FirestoreModel
```

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-1-schema.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-1-schema.ts -->

```ts
import { Merge } from 'type-fest'
import {
  $,
  $allow,
  $collectionGroups,
  $docLabel,
  $functions,
  $model,
  $or,
  DataModel,
  FirestoreModel,
  InferSchemaType,
} from 'fireschema'

// user
export const UserType = {
  name: $.string,
  displayName: $.union($.string, $.null),
  age: $.int,
  timestamp: $.timestamp,
  options: $.optional({ a: $.bool }),
}
type User = InferSchemaType<typeof UserType>
/* => {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options: { a: boolean } | undefined
} */

type UserDecoded = Merge<User, { timestamp: Date }>

const UserModel = new DataModel({
  schema: UserType,
  decoder: (data: User): UserDecoded => ({
    ...data,
    timestamp: data.timestamp.toDate(),
  }),
})

// post
const PostType = {
  tags: $.array({ id: $.int, name: $.string }),
  text: $.string,
}

const PostModel = new DataModel({
  schema: PostType,
  selectors: (q) => ({
    byTag: (tag: string) => q.where('tags', 'array-contains', tag),
  }),
})

export const firestoreModel = new FirestoreModel({
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
      [$model]: PostModel,
      [$allow]: {
        read: true,
      },
    },
  },

  // /users/{uid}
  users: {
    [$docLabel]: 'uid', // {uid}
    [$model]: UserModel, // collectionSchema
    [$allow]: {
      // access control
      read: true, // all user
      write: $or(['matchesUser(uid)', 'isAdmin()']), // only users matching {uid} or admins
    },

    // /users/{uid}/posts/{postId}
    posts: {
      [$docLabel]: 'postId',
      [$model]: PostModel,
      [$allow]: {
        read: true,
        write: 'matchesUser(uid)',
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
        (request.method != "create" || (!("_createdAt" in data) || data._createdAt == request.time))
          && (!("_updatedAt" in data) || data._updatedAt == request.time)
      );
    }

    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function matchesUser(uid) {
      return request.auth.uid == uid;
    }

    match /{path=**}/posts/{postId} {
      allow read: if true;
    }

    match /users/{uid} {
      function __validator_0__(data) {
        return (
          __validator_meta__(data)
            && data.name is string
            && (data.displayName is string || data.displayName == null)
            && data.age is int
            && data.timestamp is timestamp
            && (data.options.a is bool || !("options" in data))
        );
      }

      allow read: if true;
      allow write: if ((matchesUser(uid) || isAdmin()) && __validator_0__(request.resource.data));

      match /posts/{postId} {
        function __validator_1__(data) {
          return (
            __validator_meta__(data)
              && (data.tags.size() == 0 || (data.tags[0].id is int && data.tags[0].name is string))
              && data.text is string
          );
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

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-3-typed-firestore.ts) -->
<!-- The below code snippet is automatically added from ./src/example/1-3-typed-firestore.ts -->

```ts
import firebase from 'firebase/app' // or firebase-admin
import { TypedFirestore } from 'fireschema'
import { firestoreModel } from './1-1-schema'

const app: firebase.app.App = firebase.initializeApp({
  // ...
})
const firestoreApp = app.firestore()
firestoreApp.settings({ ignoreUndefinedProperties: true })

/**
 * Initialize TypedFirestore
 */
export const typedFirestore: TypedFirestore<
  typeof firestoreModel,
  firebase.firestore.Firestore
> = new TypedFirestore(firestoreModel, firebase.firestore, firestoreApp)

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
  await user.getData() // User

  await post.get() // DocumentSnapshot<PostA | PostB>
  await posts.get() // QuerySnapshot<PostA | PostB>
  await posts.getData() // (PostA | PostB)[]
  await techPosts.get() // QuerySnapshot<PostA | PostB>
})

/**
 * Get child collection of retrived document snapshot
 */
!(async () => {
  const snap = await users.get()
  const firstUserRef = snap.typedDocs[0]!.typedRef

  await firstUserRef.collection('posts').get()
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

### 4. React Hooks

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/1-4-react-hooks.tsx) -->
<!-- The below code snippet is automatically added from ./src/example/1-4-react-hooks.tsx -->

```tsx
import React from 'react'
import { useTypedDocument, useTypedQuery } from 'fireschema/hooks'
import { typedFirestore } from './1-3-typed-firestore'

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

## Example - Cloud Functions

### 1. Create functions

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/example/2-1-typed-functions.ts) -->
<!-- The below code snippet is automatically added from ./src/example/2-1-typed-functions.ts -->

```ts
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { $, TypedFunctions } from 'fireschema'
import { firestoreModel, UserType } from './1-1-schema'

/**
 * Initialize TypedFunctions
 */
const timezone = 'Asia/Tokyo'
const typedFunctions = new TypedFunctions(
  firestoreModel,
  firestore,
  functions,
  timezone,
)
const builder = functions.region('asia-northeast1')

/**
 * functions/index.ts file
 */
export const UserJsonType = { ...UserType, timestamp: $.string }
export const callable = {
  createUser: typedFunctions.callable({
    schema: {
      input: UserJsonType, // schema of request data (automatically validate on request)
      output: { result: $.bool }, // schema of response data
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
    schema: { text: $.string },
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
import firebase from 'firebase/app'
import React from 'react'
import { TypedCaller } from 'fireschema'

type FunctionsModule = typeof import('./2-1-typed-functions')

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

    if (result.error) {
      console.error(result.error)
      return
    }
    console.log(result.data)
  }

  return <button onClick={createUser}></button>
}
```

<!-- AUTO-GENERATED-CONTENT:END -->
