import { storeAdmin } from './firestore'

export const versions = storeAdmin.collection('root', 'versions')
export const v1 = versions.ref.doc('v1')

export const users = storeAdmin.collection(v1, 'users')
export const user = users.ref.doc('user')

export const posts = storeAdmin.collection(user, 'posts')
export const post = posts.ref.doc('post')

export const usersGroup = storeAdmin.collectionGroup(['versions', 'users'])
