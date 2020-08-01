import { STypes } from '../Fireschema'

export const dataSchema = <T>(options: STypes.DataSchemaOptions<T>) =>
  options as STypes.DataSchemaOptionsWithType<T>

export const createFireschema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => schemaOptions
