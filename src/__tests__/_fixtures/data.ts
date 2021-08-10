import {
  FirestoreStatic,
  firestoreStaticWeb,
} from '../../core/firestore/controller/_static'
import { FTypes } from '../../core/types'
import { Type } from '../../lib/type'
import { IPostA, IUser } from './firestore-schema'

export const createUserData = (
  firestoreStatic: FirestoreStatic<FTypes.FirestoreApp>,
): Type.Merge<IUser, { timestamp: FTypes.FieldValue }> => ({
  name: 'name1',
  displayName: null,
  age: 16,
  timestamp: firestoreStatic.serverTimestamp(),
  tags: [
    { id: 0, name: 'tag0' },
    { id: 1, name: 'tag1' },
  ],
  options: { a: true, b: 'value' },
})

export const userDataJson = {
  ...createUserData(firestoreStaticWeb),
  timestamp: new Date().toISOString(),
}

export const postAData: IPostA = { type: 'a', text: 'value' }
