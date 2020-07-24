import { renderRoot } from './renderers/root'
import { Fireschema } from './types/fireschema'
import { $functions } from './utils'

export const dataSchema = <T>(options: Fireschema.DataSchemaOptions<T>) =>
  options as Fireschema.DataSchemaOptionsWithType<T>

export const createFireschema = <S extends Fireschema.RootOptions.All>(
  schema: S,
) => {
  const { [$functions]: functions, ...collections } = schema

  const rendered = renderRoot(functions, collections).join('\n')

  return { schema, rendered }
}
