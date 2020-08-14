import dayjs from 'dayjs'
import { Type } from '../../lib/type'
import { FTypes } from '../../types'
import { $web } from '../_infrastructure/firestore-controller'
import { IUser } from './firestore-schema'

export const userData: Type.Merge<IUser, { timestamp: FTypes.FieldValue }> = {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: $web.FieldValue.serverTimestamp(),
  tags: [
    { id: 0, name: 'tag0' },
    { id: 1, name: 'tag1' },
  ],
  options: { a: true, b: 'value' },
}

export const userDataJson = {
  ...userData,
  timestamp: dayjs().toISOString(),
}