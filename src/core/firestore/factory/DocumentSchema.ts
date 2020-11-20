import { STypes } from '../../types'

export function $documentSchema<T, U = T>(options?: {
  decoder?: STypes.Decoder<T, U>
}): STypes.DocumentSchema<T, U> {
  return (options ?? {}) as STypes.DocumentSchema<T, U>
}
