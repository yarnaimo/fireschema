import { Timestamp as TimestampAdmin } from 'firebase-admin/firestore'
import { Timestamp } from 'firebase/firestore'

export const expectAnyTimestampWeb = () => expect.any(Timestamp)
export const expectAnyTimestampAdmin = () => expect.any(TimestampAdmin)
