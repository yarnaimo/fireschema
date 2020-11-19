import { is } from '../../lib/type'
import { FunTypes } from '../FunTypes'

export function $jsonSchema<T>(): FunTypes.JsonSchema<T> {
  return (null as unknown) as FunTypes.JsonSchema<T>
}

export const assertJsonSchema = <T extends FunTypes.JsonSchema<any>>(
  runtype: T,
) => {
  if (is.null_(runtype)) {
    throw new Error(
      'jsonSchema call expression not transformed and directly called',
    )
  }
}
