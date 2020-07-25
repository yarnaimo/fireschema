import { Fireschema } from '../types/Fireschema'
import { FireTypes } from '../types/FireTypes'

// export const adapter = <T, S = unknown>({
//   selectors,
// }: {
//   selectors: (query: FireTypes.Query<T>) => S
// }) => {}

// type Selectors<T, S> = (ref: FireTypes.Query<T>) => S

export const adapter = <T>() => {
  return <SL = {}>({
    selectors = () => ({} as SL),
  }: {
    selectors?: (q: FireTypes.Query<T>) => SL
  }) => {
    const adapter = <F extends FireTypes.Firestore>(
      q: FireTypes.Query<T, F>,
    ): Fireschema.Adapted<SL, F> => ({
      select: selectors(q) as Fireschema.Selectors<SL, F>,
    })

    return Object.assign(adapter, {
      __SL__: {} as SL,
    })
  }
}
