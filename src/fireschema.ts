import { renderRoot } from './renderers/root'
import { Fireschema } from './types'
import { $functions } from './utils'

export const dataSchema = <T>(options: Fireschema.DataSchemaOptions<T>) =>
  options

export const fireschema = <T extends Fireschema.RootOptions.All>(schema: T) => {
  const { [$functions]: functions, ...collections } = schema

  const rendered = renderRoot(functions, collections).join('\n')

  return { rendered }
}
