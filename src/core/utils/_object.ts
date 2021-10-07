import { STypes } from '../index.js'
import { JoinLoc, OmitLastSegment, ParseLocString } from '../types/_object.js'

export const getDeep = (object: object, paths: string[]) => {
  return paths.reduce(
    (parent, path) => parent[path] as never,
    object as { [key: string]: unknown },
  ) as unknown
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

export const parseLocString = <L extends string>(loc: L) =>
  (loc === '' ? [] : loc.split('.')) as ParseLocString<L>

export const getSchemaOptionsByLoc = (
  schemaOptions: STypes.RootOptions.All,
  loc: string,
) => {
  const result = parseLocString(loc).reduce((parent, segment) => {
    const foundKey = Object.keys(parent).find((key) =>
      key.startsWith(`/${segment}/{`),
    )!
    return parent[foundKey] as any
  }, schemaOptions as any)

  return result as STypes.CollectionOptions.Meta
}

export const joinLoc = <T extends string, U extends string>(
  t: T,
  u: U,
): JoinLoc<T, U> => (t === '' ? u : `${t}.${u}`) as JoinLoc<T, U>

export const getLastSegment = (loc: string): string =>
  loc.slice(loc.lastIndexOf('.') + 1)

export const omitLastSegment = <L extends string>(loc: L): OmitLastSegment<L> =>
  loc.slice(0, loc.lastIndexOf('.')) as any
