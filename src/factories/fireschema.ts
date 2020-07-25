import { $functions } from '../constants/symbols'
import { Fireschema } from '../types/Fireschema'
import { renderRoot } from '../_renderers/root'

export const dataSchema = <T>(options: Fireschema.DataSchemaOptions<T>) =>
  options as Fireschema.DataSchemaOptionsWithType<T>

export const createFireschema = <S extends Fireschema.RootOptions.All>(
  schema: S,
) => {
  const { [$functions]: functions, ...collections } = schema

  const rendered = renderRoot(functions, collections).join('\n')

  return { schema, rendered }
}
