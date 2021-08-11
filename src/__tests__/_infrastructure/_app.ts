import {
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp,
  loadFirestoreRules,
} from '@firebase/rules-unit-testing'
import { App } from 'firebase-admin/app'
import { deleteApp, FirebaseApp, getApps } from 'firebase/app'
import { MapAsync } from 'lifts'
import { renderSchema } from '../../core/firestore/_renderer/root.js'
import { firestoreModel } from '../_fixtures/firestore-schema.js'
import { projectId } from './_config.js'

const rules = renderSchema(firestoreModel)
beforeAll(async () => {
  await loadFirestoreRules({ projectId, rules })
})

export const authedApp = (uid: string): FirebaseApp =>
  initializeTestApp({ projectId, auth: { uid } })

export const authedAdminApp = (uid: string): App =>
  initializeAdminApp({ projectId })

afterEach(async () => {
  await clearFirestoreData({ projectId })
})

afterAll(async () => {
  await MapAsync(getApps(), deleteApp)
})
