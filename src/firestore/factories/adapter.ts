import { FTypes } from '../../types/FTypes'
import { STypes } from '../STypes'

export const $collectionAdapter = <T>() => {
  return <SL = {}>({
    selectors = () => ({} as SL),
  }: {
    selectors?: (q: FTypes.Query<T>) => SL
  }): STypes.CollectionAdapter<T, SL> => ({
    selectors,
    __SL__: {} as SL,
  })
}
