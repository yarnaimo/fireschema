import {
  apps,
  clearFirestoreData,
  initializeTestApp,
  loadFirestoreRules,
} from '@firebase/testing'
import { MapAsync } from 'lifts'
import { renderSchema } from '../../firestore/_renderers/root'
import { firestoreSchema } from '../_fixtures/firestore-schema'
import { projectId } from './_config'

const rules = renderSchema(firestoreSchema)
beforeAll(async () => {
  await loadFirestoreRules({ projectId, rules })
})

export const authedApp = (uid: string): firebase.app.App =>
  initializeTestApp({ projectId, auth: { uid } })

afterEach(async () => {
  await clearFirestoreData({ projectId })
})

afterAll(async () => {
  await MapAsync(apps(), (app) => app.delete())
})
