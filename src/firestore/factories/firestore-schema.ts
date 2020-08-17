import { STypes } from '../STypes'

export function $documentSchema<T>(): STypes.DocumentSchema<T> {
  throw new Error(
    'documentSchema call expression not transformed and directly called',
  )
}

export const createFirestoreSchema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => schemaOptions
