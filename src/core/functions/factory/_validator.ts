import { is } from '../../../lib/type'
import { SchemaType } from '../../types'

export const validateJsonSchema = (
  t: SchemaType.JsonValue,
  value: unknown,
): boolean => {
  switch (t.type) {
    case 'union':
      return t.valueTypes.some((_t) => validateJsonSchema(_t, value))
    case 'intersection':
      return t.valueTypes.every((_t) => validateJsonSchema(_t, value))

    case 'undefined':
      return is.undefined(value)
    case 'null':
      return is.null_(value)
    case 'bool':
      return is.boolean(value)
    case 'string':
      return is.string(value)
    case 'literal':
      return value === t.literal
    case 'int':
      return is.integer(value)
    case 'float':
      return is.number(value)

    case 'array':
      return (
        is.array(value) &&
        value.every((el) => validateJsonSchema(t.valueType, el))
      )

    default:
      return (
        is.object(value) &&
        Object.entries(t).every(([key, _t]) =>
          validateJsonSchema(_t, (value as any)[key]),
        )
      )
  }
}
