import { is } from '../lib/type'

export const arrayfy = <T>(value: T | T[]) =>
  is.array(value) ? value : [value]
