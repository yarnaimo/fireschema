import { STypes } from '../../types'

export const createFirestoreSchema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => schemaOptions
