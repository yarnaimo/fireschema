import { EntriesStrict, P } from 'lifts'
import { R } from '../../../lib/fp'
import { is } from '../../../lib/type'
import { allowOptions, STypes } from '../../types'
import { $and } from '../../utils'
import { join, _ } from '../../utils/_string'
import { addValidatorIndex, validator, validatorCall } from './format'
import { renderFunctions } from './functions'

export const renderRules = (
  $allow: STypes.AllowOptions,
  schema: STypes.CollectionSchema<any, any, any> | null,
  pIndent: number,
) => {
  if (!schema || !is.string(schema.schema)) {
    throw new Error(
      'collectionSchema call expression not transformed and directly called',
    )
  }

  const indent = pIndent + 2

  const functions = renderFunctions(
    validator('data', schema.schema, indent),
    pIndent,
  )

  const array = EntriesStrict($allow)
  const hasWriteRules = array.some(([op]) => op in allowOptions.write)

  const rules = P(
    array,
    R.map(([op, condition]) => {
      if (op in allowOptions.write && op !== 'delete') {
        return [op, $and([condition!, validatorCall('request.resource.data')])] // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
      return [op, condition]
    }),
    R.map(([op, condition]) => {
      return `${_(indent)}allow ${op}: if ${condition};`
    }),
    join('\n'),
  )

  if (hasWriteRules) {
    addValidatorIndex()
    return join('\n\n')([functions, rules])
  } else {
    return rules
  }
}
