import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  deleteField,
  documentId,
  increment,
  serverTimestamp,
} from 'firebase/firestore'
import { _admin } from '../../../lib/firestore-types.js'
import { FTypes } from '../../types/index.js'
export declare type FirestoreStatic<F extends FTypes.FirestoreApp> = FTypes.Env<
  F,
  typeof firestoreStaticWeb,
  ReturnType<typeof createFirestoreStaticAdmin>
>
export declare const firestoreStaticWeb: {
  arrayRemove: typeof arrayRemove
  arrayUnion: typeof arrayUnion
  deleteField: typeof deleteField
  documentId: typeof documentId
  increment: typeof increment
  serverTimestamp: typeof serverTimestamp
  Timestamp: typeof Timestamp
}
export declare const createFirestoreStaticAdmin: (raw: typeof _admin) => {
  arrayRemove: typeof _admin.FieldValue.arrayRemove
  arrayUnion: typeof _admin.FieldValue.arrayUnion
  deleteField: typeof _admin.FieldValue.delete
  documentId: typeof _admin.FieldPath.documentId
  increment: typeof _admin.FieldValue.increment
  serverTimestamp: typeof _admin.FieldValue.serverTimestamp
  Timestamp: typeof _admin.Timestamp
}
