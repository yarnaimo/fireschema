'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.expectAnyTimestampAdmin = exports.expectAnyTimestampWeb = void 0
const firestore_1 = require('firebase-admin/firestore')
const firestore_2 = require('firebase/firestore')
const expectAnyTimestampWeb = () => expect.any(firestore_2.Timestamp)
exports.expectAnyTimestampWeb = expectAnyTimestampWeb
const expectAnyTimestampAdmin = () => expect.any(firestore_1.Timestamp)
exports.expectAnyTimestampAdmin = expectAnyTimestampAdmin
