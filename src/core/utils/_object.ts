import { EntriesStrict, P } from 'lifts'
import { R } from '../../lib/fp'
import { is } from '../../lib/type'
import {
  GetDeepByKey,
  JoinLoc,
  OmitLastSegment,
  ParseLocString,
} from '../types/_object'

export const getDeep = (object: object, paths: string[]) => {
  return paths.reduce(
    (parent, path) => parent[path] as never,
    object as { [key: string]: unknown },
  ) as unknown
}

export const getDeepByKey = <T extends object, Key extends string>(
  obj: T,
  targetKey: Key,
): GetDeepByKey<T, Key>[] => {
  return P(
    obj,
    EntriesStrict,
    R.flatMap(([key, value]): any => {
      if (!is.object(value)) {
        return []
      }
      const children = getDeepByKey(value, targetKey)
      if (key === (targetKey as any)) {
        return [value, ...(children as any)]
      } else {
        return children
      }
    }),
  ) as any
}

export const parseLocString = <L extends string>(loc: L) =>
  (loc === '' ? [] : loc.split('.')) as ParseLocString<L>

export const getByLoc = (object: object, loc: string) =>
  getDeep(object, parseLocString(loc))

export const joinLoc = <T extends string, U extends string>(
  t: T,
  u: U,
): JoinLoc<T, U> => (t === '' ? u : `${t}.${u}`) as JoinLoc<T, U>

export const getLastSegment = (loc: string): string =>
  loc.slice(loc.lastIndexOf('.') + 1)

export const omitLastSegment = <L extends string>(loc: L): OmitLastSegment<L> =>
  loc.slice(0, loc.lastIndexOf('.')) as any
