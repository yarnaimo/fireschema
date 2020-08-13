import { EntriesStrict, P } from 'lifts'
import { R } from '../../lib/fp'
import { is } from '../../lib/type'
import { $and, $or } from '../../utils/operators'
import { join, _ } from '../../utils/_string'
import { allowOptions, STypes } from '../STypes'
import { renderFunctions } from './functions'

const renderObjectValidator = (
  object: STypes.DataSchemaOptions<any>,
  prefix: string,
): string => {
  return P(
    object,
    EntriesStrict,
    R.map(([key, type]) => [key, is.array(type) ? type : [type]] as const),
    R.map(([key, types]) => {
      const keyWithPrefix = `${prefix}.${String(key)}`
      return P(
        types,
        R.map((type) => {
          if (is.object(type)) {
            return renderObjectValidator(type, `${keyWithPrefix}`)
          }
          const op = type === 'null' ? '==' : 'is'
          return `${keyWithPrefix} ${op} ${type}`
        }),
        $or,
      )
    }),
    $and,
  )
}

let index = 0

export const renderRules = (
  $allow: STypes.AllowOptions,
  $schema: STypes.DataSchemaOptions<any> | STypes.DataSchemaOptions<any>[],
  pIndent: number,
) => {
  const indent = pIndent + 2

  const validator = (arg: string) => `__validator_${index}__(${arg})`

  const validatorBody = P(
    is.array($schema) ? $schema : [$schema],
    R.map((schema) => renderObjectValidator(schema, 'data')),
    $or,
  )

  const functions = renderFunctions(
    {
      [validator('data')]: `
        return ${validatorBody};
      `,
    },
    pIndent,
  )

  const array = EntriesStrict($allow)
  const hasWriteRules = array.some(([op]) => op in allowOptions.write)

  const rules = P(
    array,
    R.map(([op, condition]) => {
      if (op in allowOptions.write) {
        return [op, $and([condition!, validator('request.resource.data')])]
      }
      return [op, condition]
    }),
    R.map(([op, condition]) => {
      return `${_(indent)}allow ${op}: if ${condition};`
    }),
    join('\n'),
  )

  if (hasWriteRules) {
    index++
    return join('\n\n')([functions, rules])
  } else {
    return rules
  }
}
