import firebase from 'firebase/app' // or firebase-admin
import { TypedFirestore } from '..'
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
