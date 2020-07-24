import { initializeAdminApp } from '@firebase/testing'

export const appAdmin: firebase.app.App = initializeAdminApp({})
export const dbAdmin = appAdmin.firestore()
