import { EntriesStrict, P } from 'lifts'

import { R } from '../../../lib/fp.js'
import { STypes, allowOptions } from '../../types/index.js'
import { _, join } from '../../utils/_string.js'
import { $and } from '../../utils/index.js'
import { DataModel } from '../model.js'
import { addValidatorIndex, validatorCall, validatorDef } from './format.js'
import { renderFunctions } from './functions.js'
import { schemaToRuleWithMeta } from './transformer.js'

export const renderRules = (
  $allow: STypes.AllowOptions,
  model: DataModel<any, any, any>,
  pIndent: number,
) => {
  const indent = pIndent + 2

  const functions = renderFunctions(
    validatorDef('data', schemaToRuleWithMeta(model.schema), indent),
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
