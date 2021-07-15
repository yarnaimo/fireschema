import { EntriesStrict, P } from 'lifts'
import { R } from '../../../lib/fp'
import { allowOptions, STypes } from '../../types'
import { $and } from '../../utils'
import { join, _ } from '../../utils/_string'
import { DataModel } from '../model'
import { addValidatorIndex, validator, validatorCall } from './format'
import { renderFunctions } from './functions'
import { schemaToRule } from './transformer'

export const renderRules = (
  $allow: STypes.AllowOptions,
  model: DataModel<any, any, any>,
  pIndent: number,
) => {
  const indent = pIndent + 2

  const functions = renderFunctions(
    validator('data', schemaToRule()(model.schema), indent),
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
