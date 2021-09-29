import { deleteApp, getApps } from '@firebase/app'
import { getFunctions } from '@firebase/functions'
import {
  deleteApp as deleteAppAdmin,
  getApps as getAppsAdmin,
  initializeApp as initializeAdminApp,
} from 'firebase-admin/app'
import { getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import got from 'got'
import { MapAsync } from 'lifts'
import { renderSchema } from '../../core/firestore/_renderer/root.js'
import { firestoreModel } from '../_fixtures/firestore-schema.js'
import { emulatorConfig, localhost, projectId } from './_config.js'

const rules = renderSchema(firestoreModel)

const firestoreEmulatorUrl = (path: string) =>
  `http://${localhost}:${emulatorConfig.firestore.port}/emulator/v1/projects/${projectId}${path}`

beforeAll(async () => {
  await got.put(firestoreEmulatorUrl(':securityRules'), {
    body: JSON.stringify({
      rules: {
        files: [{ content: rules }],
      },
    }),
  })
})

afterEach(async () => {
  await got.delete(firestoreEmulatorUrl('/databases/(default)/documents'))
})

afterAll(async () => {
  await MapAsync(getApps(), deleteApp)
  await MapAsync(getAppsAdmin(), deleteAppAdmin)
})

const appName = () => Date.now() + '_' + Math.random()

export const getTestAppWeb = (uid: string) => {
  const app = firebase.initializeApp({ projectId }, appName())
  const firestore = app.firestore() as unknown as Firestore
  connectFirestoreEmulator(
    firestore,
    localhost,
    emulatorConfig.firestore.port,
    { mockUserToken: { user_id: uid } },
  )

  return {
    firestore: () => firestore,
    functions: (region: string) => getFunctions(app, region),
  }
}

export const getTestAppAdmin = () => {
  const app = initializeAdminApp({ projectId }, appName())
  const firestore = getFirestoreAdmin(app)
  firestore.settings({
    host: `${localhost}:${emulatorConfig.firestore.port}`,
    ssl: false,
  })
  return {
    firestore: () => firestore,
  }
}

export const assertFails = async (pr: () => Promise<any>) => {
  const _warn = console.warn
  const consoleMock = jest
    .spyOn(console, 'warn')
    .mockImplementation((...args) => {
      if (
        args.some(
          (m) => typeof m === 'string' && m.startsWith('7 PERMISSION_DENIED'),
        )
      ) {
        return
      }
      _warn(...args)
    })

  const result = await pr().then(
    async () => {
      return Promise.reject(
        new Error('Expected request to fail, but it succeeded.'),
      )
    },
    (err) => {
      const isPermissionDenied = err.code === 'permission-denied'
      if (!isPermissionDenied) {
        return Promise.reject(
          new Error(
            'Expected PERMISSION_DENIED but got unexpected error: ' + err,
          ),
        )
      }
      return err
    },
  )

  consoleMock.mockRestore()
  return result
}
