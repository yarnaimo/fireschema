import {
  clearFirestoreData,
  firestore,
  initializeAdminApp,
} from '@firebase/testing'
import { initFirestore } from '../..'
import { FirestoreController } from '../../controller'
import { schema } from '../fixtures/schema'

const projectId = 'fireschema-test'

export const appAdmin: firebase.app.App = initializeAdminApp({
  projectId,
})

afterEach(async () => {
  await clearFirestoreData({ projectId })
})

afterAll(async () => {
  await appAdmin.delete()
})

const firestoreAppAdmin = appAdmin.firestore()
// export const fireschemaAppAdmin = fireschemaApp(firestore, appAdmin.firestore())
// export const storeAdmin = initFirestore(firIeschemaAppAdmin, schema.schema)

export const storeAdmin: FirestoreController<
  typeof firestoreAppAdmin,
  typeof schema
> = initFirestore(firestore, firestoreAppAdmin, schema)
