import { EntriesStrict, P } from 'lifts'
import { R } from '../../lib/fp'
import { is } from '../../lib/type'
import { $and, $or } from '../../utils/operators'
import { arrayfy } from '../../utils/_array'
import { join, _ } from '../../utils/_string'
import { $array, arrayKey, hasArraySymbol } from '../constants'
import { allowOptions, STypes } from '../STypes'
import { renderFunctions } from './functions'

const renderObjectValidator = (
  options: STypes.DataSchemaOptions<object>,
  prefix: string,
): string => {
  return P(
    arrayfy(options),
    R.map((object) => {
      return P(
        object,
        EntriesStrict,
        R.map(([key, type]) => [key, arrayfy(type)] as const),

        R.map(([key, types]) => {
          const isArray = key === arrayKey
          const keyWithPrefix = isArray
            ? `${prefix}[0]`
            : is.string(key)
            ? `${prefix}.${key}`
            : ''

          const rule = P(
            types,
            R.map((type) => {
              if (hasArraySymbol(type)) {
                return renderObjectValidator(
                  { [arrayKey]: type[$array] } as any,
                  `${keyWithPrefix}`,
                )
              }
              if (is.object(type)) {
                return renderObjectValidator(type, keyWithPrefix)
              }
              const op = type === 'null' ? '==' : 'is'
              return `${keyWithPrefix} ${op} ${type}`
            }),
            $or,
          )
          return isArray ? $or([`${prefix}.size() == 0`, rule]) : rule
        }),
        $and,
      )
    }),
    $or,
  )
}

let index = 0

export const renderRules = (
  $allow: STypes.AllowOptions,
  $schema: STypes.DataSchemaOptions<object>, // | STypes.DataSchemaOptions<any>[],
  pIndent: number,
) => {
  const indent = pIndent + 2

  const validator = (arg: string) => `__validator_${index}__(${arg})`

  const validatorBody = renderObjectValidator($schema, 'data')

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
