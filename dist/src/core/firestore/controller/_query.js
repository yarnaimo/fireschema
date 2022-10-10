'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.queryAdmin =
  exports.queryBuilderAdmin =
  exports.queryBuilderWeb =
    void 0
const firestore_1 = require('firebase/firestore')
exports.queryBuilderWeb = {
  endAt: firestore_1.endAt,
  endBefore: firestore_1.endBefore,
  limit: firestore_1.limit,
  limitToLast: firestore_1.limitToLast,
  orderBy: firestore_1.orderBy,
  startAfter: firestore_1.startAfter,
  startAt: firestore_1.startAt,
  where: firestore_1.where,
}
exports.queryBuilderAdmin = Object.fromEntries(
  Object.keys(exports.queryBuilderWeb).map((key) => {
    return [
      key,
      (...args) => {
        return (q) => q[key](...args)
      },
    ]
  }),
)
const queryAdmin = (query, ...queryConstraints) => {
  return queryConstraints.reduce((pre, constraint) => {
    return constraint(pre)
  }, query)
}
exports.queryAdmin = queryAdmin
