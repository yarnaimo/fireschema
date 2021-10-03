import * as firestore from 'firebase-admin/firestore'

import { createFirestoreStaticAdmin } from './_static.js'

const name = (instance: any) => instance.constructor.name

describe('firestoreStaticAdmin', () => {
  const firestoreStatic = createFirestoreStaticAdmin(firestore)

  test('not equal', () => {
    expect(name(firestoreStatic.arrayRemove('a'))).not.toBe(
      name(firestoreStatic.arrayUnion('a')),
    )
  })

  test.each([
    [firestoreStatic.arrayRemove('a'), firestore.FieldValue.arrayRemove('a')],
    [firestoreStatic.arrayUnion('a'), firestore.FieldValue.arrayUnion('a')],
    [firestoreStatic.deleteField(), firestore.FieldValue.delete()],
    [firestoreStatic.documentId(), firestore.FieldPath.documentId()],
    [firestoreStatic.increment(1), firestore.FieldValue.increment(1)],
    [firestoreStatic.serverTimestamp(), firestore.FieldValue.serverTimestamp()],
  ])('%#', (result, expected) => {
    expect(name(result)).toBe(name(expected))
  })

  test('Timestamp', () => {
    expect(firestoreStatic.Timestamp).toBe(firestore.Timestamp)
  })
})
