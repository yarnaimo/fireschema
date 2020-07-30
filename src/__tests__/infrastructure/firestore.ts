import {
  apps,
  clearFirestoreData,
  firestore,
  initializeTestApp,
  loadFirestoreRules,
} from '@firebase/testing'
import { MapAsync } from 'lifts'
import { initFirestore } from '../..'
import { FirestoreController } from '../../controller'
import { renderSchema } from '../../_renderers/root'
import { schema } from '../fixtures/schema'

const projectId = 'fireschema-test'
const rules = renderSchema(schema)
loadFirestoreRules({ projectId, rules })

export const authedApp = (uid: string): firebase.app.App =>
  initializeTestApp({ projectId, auth: { uid } })

export const authedStore = (
  uid: string,
): FirestoreController<firestore.Firestore, typeof schema> => {
  const app = authedApp(uid)
  const firestoreApp = app.firestore()

  const store: FirestoreController<
    firestore.Firestore,
    typeof schema
  > = initFirestore(firestore, firestoreApp, schema)

  return store
}

export const collections = (
  store: FirestoreController<firestore.Firestore, typeof schema>,
) => {
  const versions = store.collection('root', 'versions')
  const v1 = versions.ref.doc('v1')

  const users = store.collection(v1, 'users')
  const user = users.ref.doc('user')

  const posts = store.collection(user, 'posts')
  const post = posts.ref.doc('post')

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

afterEach(async () => {
  await clearFirestoreData({ projectId })
})

afterAll(async () => {
  await MapAsync(apps(), (app) => app.delete())
})
