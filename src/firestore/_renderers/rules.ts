import { EntriesStrict, P } from 'lifts'
import { R } from '../../lib/fp'
import { is } from '../../lib/type'
import { $and, $or } from '../../utils/operators'
import { join, _ } from '../../utils/_string'
import { allowOptions, STypes } from '../STypes'
import { renderFunctions } from './functions'

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
    R.map(EntriesStrict),
    R.map(
      R.flatMap(([key, type]) => {
        return P(
          type.split(' | '),
          R.map((t) => {
            const op = t === 'null' ? '==' : 'is'
            return `data.${String(key)} ${op} ${t}`
          }),
          $or,
        )
      }),
    ),
    R.map($and),
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
