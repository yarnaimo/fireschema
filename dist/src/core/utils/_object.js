'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.omitLastSegment =
  exports.getLastSegment =
  exports.joinLoc =
  exports.getCollectionOptionsByName =
  exports.getSchemaOptionsByLoc =
  exports.parseLocString =
  exports.getDeep =
    void 0
const getDeep = (object, paths) => {
  return paths.reduce((parent, path) => parent[path], object)
}
exports.getDeep = getDeep
// export const getDeepByKey = <T extends object, Key extends string>(
//   obj: T,
//   targetKey: Key,
// ): GetDeepByKey<T, Key>[] => {
//   return P(
//     obj,
//     EntriesStrict,
//     R.flatMap(([key, value]): any => {
//       if (!is.object(value)) {
//         return []
//       }
//       const children = getDeepByKey(value, targetKey)
//       if (key === (targetKey as any)) {
//         return [value, ...(children as any)]
//       } else {
//         return children
//       }
//     }),
//   ) as any
// }
const parseLocString = (loc) => (loc === '' ? [] : loc.split('.'))
exports.parseLocString = parseLocString
const getSchemaOptionsByLoc = (schemaOptions, loc) => {
  const result = (0, exports.parseLocString)(loc).reduce((parent, segment) => {
    const foundKey = Object.keys(parent).find((key) =>
      key.startsWith(`/${segment}/{`),
    )
    return parent[foundKey]
  }, schemaOptions)
  return result
}
exports.getSchemaOptionsByLoc = getSchemaOptionsByLoc
const getCollectionOptionsByName = (
  options,
  targetCollectionName,
  _loc = '',
) => {
  return Object.entries(options).flatMap(([key, value]) => {
    var _a
    const collectionName =
      (_a = key.match(/^\/(.+)\/\{.+\}$/)) === null || _a === void 0
        ? void 0
        : _a[1]
    if (!collectionName) {
      return []
    }
    const loc = (0, exports.joinLoc)(_loc, collectionName)
    return [
      ...(collectionName === targetCollectionName
        ? [{ loc, options: value }]
        : []),
      ...(0, exports.getCollectionOptionsByName)(
        value,
        targetCollectionName,
        loc,
      ),
    ]
  })
}
exports.getCollectionOptionsByName = getCollectionOptionsByName
const joinLoc = (t, u) => (t === '' ? u : `${t}.${u}`)
exports.joinLoc = joinLoc
const getLastSegment = (loc) => loc.slice(loc.lastIndexOf('.') + 1)
exports.getLastSegment = getLastSegment
const omitLastSegment = (loc) => loc.slice(0, loc.lastIndexOf('.'))
exports.omitLastSegment = omitLastSegment
