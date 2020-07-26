import {
  clearFirestoreData,
  firestore,
  initializeAdminApp,
} from '@firebase/testing'
import { initFirestore } from '../..'
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

// export const fireschemaAppAdmin = fireschemaApp(firestore, appAdmin.firestore())
// export const storeAdmin = initFirestore(fireschemaAppAdmin, schema.schema)
export const storeAdmin = initFirestore(
  firestore,
  appAdmin.firestore(),
  schema.schema,
)
