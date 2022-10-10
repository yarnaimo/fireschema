export const getDeep = (object, paths) => {
  return paths.reduce((parent, path) => parent[path], object)
}
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
export const parseLocString = (loc) => (loc === '' ? [] : loc.split('.'))
export const getSchemaOptionsByLoc = (schemaOptions, loc) => {
  const result = parseLocString(loc).reduce((parent, segment) => {
    const foundKey = Object.keys(parent).find((key) =>
      key.startsWith(`/${segment}/{`),
    )
    return parent[foundKey]
  }, schemaOptions)
  return result
}
export const getCollectionOptionsByName = (
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
    const loc = joinLoc(_loc, collectionName)
    return [
      ...(collectionName === targetCollectionName
        ? [{ loc, options: value }]
        : []),
      ...getCollectionOptionsByName(value, targetCollectionName, loc),
    ]
  })
}
export const joinLoc = (t, u) => (t === '' ? u : `${t}.${u}`)
export const getLastSegment = (loc) => loc.slice(loc.lastIndexOf('.') + 1)
export const omitLastSegment = (loc) => loc.slice(0, loc.lastIndexOf('.'))
