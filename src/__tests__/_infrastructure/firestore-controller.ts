import { firestore } from '@firebase/testing'
import { FirestoreController } from '../..'
import { firestoreSchema } from '../_fixtures/firestore-schema'
import { authedStore } from './firestore'

export const $web: FirestoreController<
  firestore.Firestore,
  typeof firestoreSchema
> = authedStore('user')

export const $webUnauthed: FirestoreController<
  firestore.Firestore,
  typeof firestoreSchema
> = authedStore('unauthed')
