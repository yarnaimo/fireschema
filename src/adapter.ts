type Selectors<T> = <F>(ref: FireTypes.Query<T, F>) => unknown

type Adapter<T> = {
  selectors: Selectors<T>
}

export const adapter = <T>() => {
  return <S extends Selectors<T>>({
    selectors = () => ({})
  }: {
    selectors?: S
  }) => {
    return {
      selectors,
    }
  }
}
