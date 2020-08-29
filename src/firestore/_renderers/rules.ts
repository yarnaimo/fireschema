import { EntriesStrict, P } from 'lifts'
import { R } from '../../lib/fp'
import { is } from '../../lib/type'
import { $and } from '../../utils/operators'
import { join, _ } from '../../utils/_string'
import { allowOptions, STypes } from '../STypes'
import { renderFunctions } from './functions'

let index = 0

export const renderRules = (
  $allow: STypes.AllowOptions,
  schema: STypes.DocumentSchema<any> | null,
  pIndent: number,
) => {
  if (!is.string(schema)) {
    throw new Error(
      'documentSchema call expression not transformed and directly called',
    )
  }

  const indent = pIndent + 2

  const validator = (arg: string) => `__validator_${index}__(${arg})`

  const validatorBody = schema
    .split('\n')
    .map((line, i, arr) => {
      return i === 0
        ? line
        : i === arr.length - 1 || line === ') || (' || line === ') && ('
        ? `${_(indent + 2)}${line}`
        : `${_(indent + 4)}${line}`
    })
    .join('\n')

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
        return [op, $and([condition!, validator('request.resource.data')])] // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
