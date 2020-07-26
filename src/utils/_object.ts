import { EntriesStrict, P } from 'lifts'
import { R } from '../lib/fp'
import { is } from '../lib/type'
import { GetDeep, GetDeepByKey, Loc } from '../types/_object'

export const getDeep = <T extends object, L extends Loc<T> & string[]>(
  object: T,
  paths: L,
) => {
  return (paths.reduce((state, path) => {
    return state[path] as never
  }, object as { [key: string]: unknown }) as unknown) as GetDeep<T, L>
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
