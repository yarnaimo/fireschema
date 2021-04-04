import { FTypes, STypes } from '../../types'

export function $collectionSchema<T, U = T>() {
  // eslint-disable-next-line prefer-rest-params
  const rawFirstArgument = arguments[0] ?? {}

  return <SL = {}>({
    decoder,
    selectors = () => ({} as SL),
  }: {
    decoder?: STypes.Decoder<T, U>
    selectors?: (q: FTypes.Query<U>) => SL
  } = {}): STypes.CollectionSchema<T, U, SL> => {
    return {
      ...rawFirstArgument,
      decoder,
      selectors,
    } as STypes.CollectionSchema<T, U, SL>
  }
}
