import { P } from 'lifts'
import { R } from '../../../lib/fp.js'
import { is } from '../../../lib/type.js'
import { SchemaType } from '../../types/SchemaType.js'
import { $$and, $and, $or, $rule } from '../../utils/index.js'

export const schemaToRuleWithMeta = (t: SchemaType.Value): string => {
  return $and([`__validator_meta__(data)`, _schemaToRule()(t)])
}

export const _schemaToRule =
  (parent: string | null = null, key: string | 0 = 'data') =>
  (t: SchemaType.Value): string => {
    const name = is.null_(parent)
      ? (key as string)
      : key === 0
      ? `${parent}[0]`
      : `${parent}.${key}`

    switch (t.type) {
      case 'union':
        return P(t.valueTypes, R.map(_schemaToRule(parent, key)), $or)
      case 'intersection':
        return P(t.valueTypes, R.map(_schemaToRule(parent, key)), $and)

      case 'unknown':
        return 'true'
      case 'undefined':
        return $rule.notExists(key, parent)
      case 'null':
        return $rule.isNull(name)
      case 'bool':
        return $rule.isBool(name)
      case 'string':
        return $rule.isString(name)
      case 'literal':
        return $rule.isLiteralOf(name, JSON.stringify(t.literal))
      case 'int':
        return $rule.isInt(name)
      case 'float':
        return $rule.isFloat(name)
      case 'timestamp':
        return $rule.isTimestamp(name)

      case 'array':
        return $or([
          $rule.isEmptyArray(name),
          _schemaToRule(name, 0)(t.valueType),
        ])

      default:
        return P(
          Object.entries(t),
          R.map(([key, _t]) => {
            return _schemaToRule(name, key)(_t)
          }),
          (rules) => {
            if (name !== 'data') {
              return rules
            }
            const keysArray = `[${Object.keys(t)
              .map((k) => `'${k}'`)
              .join(', ')}]`
            return [`__validator_keys__(data, ${keysArray})`, ...rules]
          },
          name === 'data' ? $$and : $and,
        )
    }
  }
