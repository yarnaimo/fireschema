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

!(async () => {
  await userRef.get() // DocumentSnapshot<User>
  await userRef.getData() // User

  await postRef.get() // DocumentSnapshot<PostA | PostB>
  await postsRef.get() // QuerySnapshot<PostA | PostB>
  await postsRef.getData() // (PostA | PostB)[]
  await techPostsQuery.get() // QuerySnapshot<PostA | PostB>
})

/**
 * Get child collection of retrived document snapshot
 */
!(async () => {
  const snap = await usersRef.get()
  const firstUserRef = snap.typedDocs[0]!.typedRef

  await firstUserRef.collection('posts').get()
})

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

!(async () => {
  await postsGroup.get() // QuerySnapshot<PostA | PostB>
  await techPostsGroup.get() // QuerySnapshot<PostA | PostB>
})

/**
 * Write data
 */
!(async () => {
  await userRef.create({
    name: 'test',
    displayName: 'Test',
    age: 20,
    timestamp: typedFirestore.firestoreStatic.serverTimestamp(),
    options: { a: true },
  })
  await userRef.setMerge({
    age: 21,
  })
  await userRef.update({
    age: 21,
  })
  await userRef.delete()
})

/**
 * Transaction
 */
!(async () => {
  await typedFirestore.runTransaction(async (tt) => {
    const snap = await tt.get(userRef)
    tt.update(userRef, {
      age: snap.data()!.age + 1,
    })
  })
})
