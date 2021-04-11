import { firestore } from '@firebase/rules-unit-testing'
import { FTypes } from '../../core/types'
import { Type } from '../../lib/type'
import { IPostA, IUser } from './firestore-schema'

export const userData: Type.Merge<IUser, { timestamp: FTypes.FieldValue }> = {
  name: 'name1',
  displayName: null,
  age: 16,
  timestamp: firestore.FieldValue.serverTimestamp(),
  tags: [
    { id: 0, name: 'tag0' },
    { id: 1, name: 'tag1' },
  ],
  options: { a: true, b: 'value' },
}

export const userDataJson = {
  ...userData,
  timestamp: new Date().toISOString(),
}

export const postAData: IPostA = { type: 'a', text: 'value' }
