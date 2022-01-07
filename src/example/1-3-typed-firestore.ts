import { initializeApp } from 'firebase/app' // or firebase-admin
import { initializeFirestore } from 'firebase/firestore'

import { TypedFirestoreWeb } from '../index.js'
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
export const $web: TypedFirestoreWeb<typeof firestoreModel> =
  new TypedFirestoreWeb(firestoreModel, firestoreApp)

/**
 * Reference collections/documents and get snapshot
 */
const usersRef = $web.collection('users') // TypedCollectionRef instance
const userRef = usersRef.doc('userId') // TypedDocumentRef instance

const postsRef = userRef.collection('posts')
const postRef = postsRef.doc('123')
const techPostsQuery = postsRef.select.byTag('tech') // selector defined in schema

await userRef.get() // TypedDocumentSnap<User>
await userRef.getData() // User | undefined
await userRef.getDataOrThrow() // User

await postRef.get() // TypedDocumentSnap<PostA | PostB>
await postsRef.get() // TypedQuerySnap<PostA | PostB>
await postsRef.getData() // (PostA | PostB)[]
await techPostsQuery.get() // TypedQuerySnap<PostA | PostB>

/**
 * Get child collection of retrived document snapshot
 */
const snap = await usersRef.get()
const firstUserRef = snap.docs[0]!.ref

await firstUserRef.collection('posts').get()

/**
 * Reference parent collection/document
 */
const _postsRef = postRef.parentCollection()
const _userRef = postsRef.parentDocument()

/**
 * Reference collections groups and get snapshot
 */
const postsGroup = $web.collectionGroup('posts')
const techPostsGroup = postsGroup.select.byTag('tech')

await postsGroup.get() // TypedQuerySnap<PostA | PostB>
await techPostsGroup.get() // TypedQuerySnap<PostA | PostB>

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
await $web.runTransaction(async (tt) => {
  const snap = await tt.get(userRef)
  tt.update(userRef, {
    age: snap.data()!.age + 1,
  })
})
