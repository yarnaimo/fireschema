import { firestore } from 'firebase-admin'
import { initFirestore } from '../..'
import { dbAdmin } from '../infrastructure/firestore'
import { schema } from './schema'

// export const usersRefRaw = dbAdmin.collection(
//   'users',
// ) as FireTypes.CollectionRef<IUser>

const storeAdmin = initFirestore(firestore, dbAdmin, schema.schema)

export const versions = storeAdmin.collection('root', 'versions')
export const v1 = versions.ref.doc('v1')

export const users = storeAdmin.collection(v1, 'users')
export const user = users.ref.doc('user')

export const posts = storeAdmin.collection(user, 'posts')
export const post = posts.ref.doc('post')
