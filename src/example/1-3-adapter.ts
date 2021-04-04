import firebase from 'firebase/app' // または firebase-admin
import {
  createFirestoreRefAdapter,
  createFirestoreWriteAdapter,
  FirestoreRefAdapter,
  FirestoreWriteAdapter,
} from '..'
import { firestoreSchema } from './1-1-schema'

/**
 * コントローラの初期化
 */
const app: firebase.app.App = firebase.initializeApp({
  // ...
})
export const firestoreApp = app.firestore()

export const $: FirestoreRefAdapter<
  typeof firestoreSchema
> = createFirestoreRefAdapter(firestoreSchema)
export const $web: FirestoreWriteAdapter<firebase.firestore.Firestore> = createFirestoreWriteAdapter(
  firebase.firestore,
  firestoreApp,
)

/**
 * コレクションの参照・データ取得
 */
const users = $.collection(firestoreApp, 'users') // /users
const user = users.doc('userId') // /users/userId

const posts = $.collection(user, 'posts') // /users/userId/posts
const post = posts.doc('123') // /users/userId/posts/123
const techPosts = $.collectionQuery(user, 'posts', (q) => q.byTag('tech'))

post.get() // Promise<DocumentSnapshot<PostA | PostB>>
posts.get() // Promise<QuerySnapshot<PostA | PostB>>
techPosts.get() // Promise<QuerySnapshot<PostA | PostB>>

/**
 * コレクションの親ドキュメントを参照
 */
const _user = $.getParentDocumentRef(posts) // DocumentReference<User>

/**
 * DocumentReference に型をつける
 */
const untypedPostRef = firestoreApp.doc('users/{uid}/posts/post')
const _post = $.typeDocument('users/{uid}/posts', untypedPostRef) // DocumentReference<PostA | PostB>

/**
 * コレクショングループの参照・データ取得
 */
const postsGroup = $.collectionGroup(firestoreApp, 'users/{uid}/posts')
const techPostsGroup = $.collectionGroupQuery(
  firestoreApp,
  'users/{uid}/posts',
  (q) => q.byTag('tech'),
)

postsGroup.get() // Promise<QuerySnapshot<PostA | PostB>>
techPostsGroup.get() // Promise<QuerySnapshot<PostA | PostB>>

/**
 * ドキュメントの作成・更新
 */
$web.create(user, {
  name: 'test',
  displayName: 'Test',
  age: 20,
  timestamp: $web.FieldValue.serverTimestamp(),
  options: { a: true },
})
$web.setMerge(user, {
  age: 17,
})
$web.update(user, {
  age: 17,
})
$web.delete(user)

/**
 * トランザクション
 */
$web.runTransaction(async (tc) => {
  const snap = await tc.get(user)
  tc.setMerge(user, {
    age: snap.data()!.age + 1,
  })
})
