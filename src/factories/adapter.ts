import { STypes } from '../types/Fireschema'
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
    ): STypes.Adapted<null, SL, F> => ({
      select: selectors(q) as STypes.Selectors<null, SL, F>,
    })

    return adapter as STypes.Adapter<T, null, SL, FTypes.FirestoreApp>
  }
}
