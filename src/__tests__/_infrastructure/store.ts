import { firestore } from '@firebase/testing'
import { FirestoreController } from '../..'
import { schema } from '../_fixtures/schema'
import { authedStore } from './firestore'

export const $web: FirestoreController<
  firestore.Firestore,
  typeof schema
> = authedStore('user')

export const $webUnauthed: FirestoreController<
  firestore.Firestore,
  typeof schema
> = authedStore('unauthed')
