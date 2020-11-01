import { STypes } from '../STypes'

export function $documentSchema<T, U = T>(options?: {
  decoder?: STypes.Decoder<T, U>
}): STypes.DocumentSchema<T, U> {
  return (null as unknown) as STypes.DocumentSchema<T, U>
}

export const createFirestoreSchema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => schemaOptions
