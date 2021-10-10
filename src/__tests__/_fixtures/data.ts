import {
  FirestoreStatic,
  firestoreStaticWeb,
} from '../../core/firestore/controller/_static.js'
import { FTypes } from '../../core/types/index.js'
import { Type } from '../../lib/type.js'
import { IPostA, IUser } from './firestore-schema.js'

export const userDataBase = {
  name: 'name1',
  displayName: null,
  age: 16,
  tags: [
    { id: 0, name: 'tag0' },
    { id: 1, name: 'tag1' },
  ],
  options: { a: true, b: 'value' },
}

export const createUserData = ({
  serverTimestamp,
}: FirestoreStatic<FTypes.FirestoreApp>): Type.Merge<
  IUser,
  { timestamp: FTypes.FieldValue }
> => ({
  ...userDataBase,
  timestamp: serverTimestamp(),
})

export const userDataJson = {
  ...createUserData(firestoreStaticWeb),
  timestamp: new Date().toISOString(),
}

export const postAData: IPostA = { type: 'a', text: 'value' }
