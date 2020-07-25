import { is } from '../lib/type'

export const _ = (n: number) => ' '.repeat(n)

export const join = (separator: string) => (array: (string | null)[]) =>
  is.emptyArray(array) ? null : array.filter(is.string).join(separator)
