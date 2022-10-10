'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const firebase_admin_1 = require('firebase-admin')
const firebase_functions_test_1 = require('firebase-functions-test')
const _static_js_1 = require('../../core/firestore/controller/_static.js')
const data_js_1 = require('../_fixtures/data.js')
const firestore_schema_js_1 = require('../_fixtures/firestore-schema.js')
const functions_server_js_1 = require('../_services/functions-server.js')
const ftest = (0, firebase_functions_test_1.default)()
const userPath = 'versions/v1/users/user'
const postPath = 'versions/v1/users/user/posts/post'
const userData = (0, data_js_1.createUserData)(_static_js_1.firestoreStaticWeb)
const userDataWithTs = {
  ...userData,
  timestamp: firebase_admin_1.firestore.Timestamp.fromDate(new Date()),
}
const userDataWithTsUpdated = { ...userDataWithTs, age: userDataWithTs.age + 1 }
test('onPostCreate', async () => {
  const snap = ftest.firestore.makeDocumentSnapshot(
    data_js_1.postAData,
    postPath,
  )
  const wrapped = ftest.wrap(
    functions_server_js_1.firestoreTrigger.onPostCreate,
  )
  const result = await wrapped(snap)
  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual(data_js_1.postAData)
})
test('onUserCreate', async () => {
  const snap = ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath)
  const wrapped = ftest.wrap(
    functions_server_js_1.firestoreTrigger.onUserCreate,
  )
  const result = await wrapped(snap)
  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual(
    (0, firestore_schema_js_1.decodeUser)(userDataWithTs),
  )
})
test('onUserDelete', async () => {
  const snap = ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath)
  const wrapped = ftest.wrap(
    functions_server_js_1.firestoreTrigger.onUserDelete,
  )
  const result = await wrapped(snap)
  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual(
    (0, firestore_schema_js_1.decodeUser)(userDataWithTs),
  )
})
test('onUserUpdate', async () => {
  const snap = {
    before: ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath),
    after: ftest.firestore.makeDocumentSnapshot(
      userDataWithTsUpdated,
      userPath,
    ),
  }
  const wrapped = ftest.wrap(
    functions_server_js_1.firestoreTrigger.onUserUpdate,
  )
  const result = await wrapped(snap)
  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual({
    before: (0, firestore_schema_js_1.decodeUser)(userDataWithTs),
    after: (0, firestore_schema_js_1.decodeUser)(userDataWithTsUpdated),
  })
})
test('onUserWrite', async () => {
  const snap = {
    before: ftest.firestore.makeDocumentSnapshot(undefined, userPath),
    after: ftest.firestore.makeDocumentSnapshot(userDataWithTs, userPath),
  }
  const wrapped = ftest.wrap(functions_server_js_1.firestoreTrigger.onUserWrite)
  const result = await wrapped(snap)
  expect(result.snap).toEqual(snap)
  expect(result.decodedData).toEqual({
    before: undefined,
    after: (0, firestore_schema_js_1.decodeUser)(userDataWithTs),
  })
})
