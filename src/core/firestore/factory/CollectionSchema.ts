import { FTypes, STypes } from '../../types'

export function $collectionSchema<T, _U = undefined>() {
  // eslint-disable-next-line prefer-rest-params
  const rawFirstArgument = arguments[0] ?? {}

  type HasDecoder = _U extends undefined ? false : true
  type U = _U extends undefined ? T : _U

  type DecoderOptions = HasDecoder extends true
    ? { decoder: STypes.Decoder<T, U> }
    : { decoder?: undefined }

  return <SL = {}>({
    decoder,
    selectors = () => ({} as SL),
  }: DecoderOptions & {
    selectors?: (
      q: FTypes.Query<U>,
      firestoreStatic: FTypes.FirestoreStatic<FTypes.FirestoreApp>,
    ) => SL
  }): STypes.CollectionSchema<T, U, HasDecoder, SL> => {
    return {
      ...rawFirstArgument,
      decoder,
      selectors,
    }
  }
}
