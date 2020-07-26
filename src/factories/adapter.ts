import { Fireschema } from '../types/Fireschema'
import { FTypes } from '../types/FTypes'

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
    selectors?: (q: FTypes.Query<T>) => SL
  }) => {
    const adapter = <F extends FTypes.FirestoreApp>(
      q: FTypes.Query<T, F>,
    ): Fireschema.Adapted<SL, F> => ({
      select: selectors(q) as Fireschema.Selectors<SL, F>,
    })

    return adapter as typeof adapter & { __SL__: SL }
  }
}
