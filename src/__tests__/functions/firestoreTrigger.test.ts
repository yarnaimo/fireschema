import { firestore } from 'firebase-admin'
import functionsTest from 'firebase-functions-test'

import { firestoreStaticWeb } from '../../core/firestore/controller/_static.js'
import { createUserData, postAData } from '../_fixtures/data.js'
import { decodeUser } from '../_fixtures/firestore-schema.js'
import { firestoreTrigger } from '../_infrastructure/functions-server.js'

const ftest = functionsTest()
const userPath = 'versions/v1/users/user'
const postPath = 'versions/v1/users/user/posts/post'

const userData = createUserData(firestoreStaticWeb)
const userDataWithTs = {
  ...userData,
  timestamp: firestore.Timestamp.fromDate(new Date()),
}
const userDataWithTsUpdated = { ...userDataWithTs, age: userDataWithTs.age + 1 }

test('onPostCreate', async () => {
  const snap = ftest.firestore.makeDocumentSnapshot(postAData, postPath)
  const wrapped = ftest.wrap(firestoreTrigger.onPostCreate)
  const result = await wrapped(snap)

  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual(postAData)
})

test('onUserCreate', async () => {
  const snap = ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath)
  const wrapped = ftest.wrap(firestoreTrigger.onUserCreate)
  const result = await wrapped(snap)

  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual(decodeUser(userDataWithTs))
})

test('onUserDelete', async () => {
  const snap = ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath)
  const wrapped = ftest.wrap(firestoreTrigger.onUserDelete)
  const result = await wrapped(snap)

  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual(decodeUser(userDataWithTs))
})

test('onUserUpdate', async () => {
  const snap = {
    before: ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath),
    after: ftest.firestore.makeDocumentSnapshot(
      userDataWithTsUpdated,
      userPath,
    ),
  }
  const wrapped = ftest.wrap(firestoreTrigger.onUserUpdate)
  const result = await wrapped(snap)

  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual({
    before: decodeUser(userDataWithTs),
    after: decodeUser(userDataWithTsUpdated),
  })
})

test('onUserWrite', async () => {
  const snap = {
    before: ftest.firestore.makeDocumentSnapshot(undefined as any, userPath),
    after: ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath),
  }
  const wrapped = ftest.wrap(firestoreTrigger.onUserWrite)
  const result = await wrapped(snap)

  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual({
    before: undefined,
    after: decodeUser(userDataWithTs),
  })
})
