import {
  arrayRemove,
  arrayUnion,
  deleteField,
  documentId,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { _admin } from '../../../lib/firestore-types'
import { FTypes } from '../../types/index.js'

export type FirestoreStatic<F extends FTypes.FirestoreApp> = FTypes.Env<
  F,
  typeof firestoreStaticWeb,
  ReturnType<typeof createFirestoreStaticAdmin>
>

export const firestoreStaticWeb = {
  arrayRemove,
  arrayUnion,
  deleteField,
  documentId,
  increment,
  serverTimestamp,
  Timestamp,
}

export const createFirestoreStaticAdmin = (raw: typeof _admin) => {
  return {
    arrayRemove: raw.FieldValue.arrayRemove.bind(raw.FieldValue),
    arrayUnion: raw.FieldValue.arrayUnion.bind(raw.FieldValue),
    deleteField: raw.FieldValue.delete.bind(raw.FieldValue),
    documentId: raw.FieldPath.documentId.bind(raw.FieldPath),
    increment: raw.FieldValue.increment.bind(raw.FieldValue),
    serverTimestamp: raw.FieldValue.serverTimestamp.bind(raw.FieldValue),
    Timestamp: raw.Timestamp,
  }
}
