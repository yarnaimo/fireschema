import { STypes } from '../STypes'

export function $documentSchema<T>(): STypes.DocumentSchema<T> {
  return (null as unknown) as STypes.DocumentSchema<T>
}

export const createFirestoreSchema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => schemaOptions
