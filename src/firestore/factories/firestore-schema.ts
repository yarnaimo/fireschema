import { STypes } from '../STypes'

export const documentSchema = <T>(options: STypes.DataSchemaOptions<T>) =>
  options as STypes.DataSchemaOptionsWithType<T>

export const createFirestoreSchema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => schemaOptions
