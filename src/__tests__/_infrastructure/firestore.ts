import { firestore } from '@firebase/testing'
import { FirestoreController, initFirestore } from '../..'
import { firestoreSchema } from '../_fixtures/firestore-schema'
import { authedApp } from './_app'

export const authedStore = (
  uid: string,
): FirestoreController<firestore.Firestore, typeof firestoreSchema> => {
  const app = authedApp(uid)
  const firestoreApp = app.firestore()

  const store: FirestoreController<
    firestore.Firestore,
    typeof firestoreSchema
  > = initFirestore(firestore, firestoreApp, firestoreSchema)

  return store
}

export const collections = (
  store: FirestoreController<firestore.Firestore, typeof firestoreSchema>,
) => {
  const versions = store.collection('root', 'versions')
  const v1 = versions.doc('v1')

  const users = store.collection(v1, 'users')
  const user = users.doc('user')

  const posts = store.collection(user, 'posts')
  const post = posts.doc('post')

  const usersGroup = store.collectionGroup(['versions', 'users'])

  return {
    versions,
    v1,
    users,
    user,
    posts,
    post,
    usersGroup,
  }
}
