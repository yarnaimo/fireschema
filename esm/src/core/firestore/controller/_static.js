import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  deleteField,
  documentId,
  increment,
  serverTimestamp,
} from 'firebase/firestore'
export const firestoreStaticWeb = {
  arrayRemove,
  arrayUnion,
  deleteField,
  documentId,
  increment,
  serverTimestamp,
  Timestamp,
}
export const createFirestoreStaticAdmin = (raw) => {
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
