'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const firestore = require('firebase-admin/firestore')
const _static_js_1 = require('./_static.js')
const name = (instance) => instance.constructor.name
describe('firestoreStaticAdmin', () => {
  const firestoreStatic = (0, _static_js_1.createFirestoreStaticAdmin)(
    firestore,
  )
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
