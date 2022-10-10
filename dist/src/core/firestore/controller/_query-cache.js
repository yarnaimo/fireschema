'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.withDecoder = exports.addQueryCache = exports.findCachedQuery = void 0
const _firestore_js_1 = require('../../utils/_firestore.js')
const _universal_js_1 = require('./_universal.js')
const queryCache = {}
const findCachedQuery = (collectionName, rawQuery) => {
  var _a
  const queries = queryCache[collectionName]
  return (_a =
    queries === null || queries === void 0
      ? void 0
      : queries.find((q) =>
          (0, _universal_js_1.queryEqualUniv)(q.raw, rawQuery),
        )) === null || _a === void 0
    ? void 0
    : _a.converted
}
exports.findCachedQuery = findCachedQuery
const addQueryCache = (collectionName, rawQuery, convertedQuery) => {
  const queries = queryCache[collectionName]
  const newQueries = [
    ...(queries !== null && queries !== void 0 ? queries : []),
    { raw: rawQuery, converted: convertedQuery },
  ]
  queryCache[collectionName] = newQueries
}
exports.addQueryCache = addQueryCache
const withDecoder = (rawQuery, model, collectionName) => {
  const { decoder } = model
  const cachedQuery = (0, exports.findCachedQuery)(collectionName, rawQuery)
  if (cachedQuery) {
    return cachedQuery
  }
  const convertedQuery = rawQuery.withConverter(
    (0, _firestore_js_1.createConverter)(decoder),
  )
  ;(0, exports.addQueryCache)(collectionName, rawQuery, convertedQuery)
  return convertedQuery
}
exports.withDecoder = withDecoder
