import firebase from 'firebase/app' // または firebase-admin
import { TypedFirestore } from '../core'
import { firestoreSchema } from './1-1-schema'

/**
 * コントローラの初期化
 */
const app: firebase.app.App = firebase.initializeApp({
  // ...
})
export const firestoreApp = app.firestore()

export const typedFirestore: TypedFirestore<
  typeof firestoreSchema,
  firebase.firestore.Firestore
> = new TypedFirestore(firestoreSchema, firebase.firestore, firestoreApp)

/**
 * コレクションの参照・データ取得
 */
const users = typedFirestore.collection('users')
const user = users.doc('userId')

const posts = user.collection('posts')
const post = posts.doc('123')
const techPosts = user.collectionQuery('posts', (q) => q.byTag('tech'))

!(async () => {
  await post.get() // DocumentSnapshot<PostA | PostB>
  await posts.get() // QuerySnapshot<PostA | PostB>
  await techPosts.get() // QuerySnapshot<PostA | PostB>
})

!(async () => {
  const snap = await users.get()
  const firstUserRef = snap.docs[0]!.ref

  const postsOfFirstUser = typedFirestore
    .wrapDocument(firstUserRef)
    .collection('posts')
  await postsOfFirstUser.get()
})

const _posts = post.parentCollection()
const _user = posts.parentDocument()

/**
 * コレクショングループの参照・データ取得
 */
const postsGroup = typedFirestore.collectionGroup('posts', 'users.posts')
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
 * ドキュメントの作成・更新
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
 * トランザクション
 */
!(async () => {
  await typedFirestore.runTransaction(async (tt) => {
    const snap = await tt.get(user)
    tt.update(user, {
      age: snap.data()!.age + 1,
    })
  })
})
