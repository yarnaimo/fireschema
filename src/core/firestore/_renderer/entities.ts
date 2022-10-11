import { EntriesStrict, P } from 'lifts'

import { R } from '../../../lib/fp.js'
import { STypes, allowOptions } from '../../types/index.js'
import { _, join } from '../../utils/_string.js'
import { rules } from '../../utils/index.js'
import { DataModel } from '../model.js'
import { addValidatorIndex, validatorCall, validatorDef } from './format.js'
import { renderFunctions } from './functions.js'
import { schemaToRuleWithMeta } from './transformer.js'

export const renderEntities = (
  $allow: STypes.AllowOptions,
  model: DataModel<any, any, any> | undefined,
  pIndent: number,
) => {
  const indent = pIndent + 2

  const functions = model
    ? renderFunctions(
        validatorDef('data', schemaToRuleWithMeta(model.schema), indent),
        pIndent,
      )
    : null

  const array = EntriesStrict($allow)
  const hasWriteRules = array.some(([op]) => op in allowOptions.write)

  const rulesStr = P(
    array,
    R.map(([op, condition]) => {
      if (op in allowOptions.write && op !== 'delete') {
        return [
          op,
          rules.and(condition!, validatorCall('request.resource.data')),
        ]
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
    return join('\n\n')([functions, rulesStr])
  } else {
    return rulesStr
  }
}
