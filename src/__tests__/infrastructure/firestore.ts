import { initializeAdminApp } from '@firebase/testing'

export const appAdmin: firebase.app.App = initializeAdminApp({
  projectId: 'fireschema-test',
})
export const dbAdmin = appAdmin.firestore()
