import { EntriesStrict } from 'lifts'

import { STypes, allowOptions } from '../../types/index.js'
import { join } from '../../utils/_string.js'
import { DataModel } from '../model.js'
import { renderClasses } from './class.js'
import { addValidatorIndex, validatorDef } from './format_dart.js'
import { schemaToFiledsWithMeta } from './transformer_dart.js'

export const renderEntities = (
  $allow: STypes.AllowOptions,
  model: DataModel<any, any, any> | undefined,
  pIndent: number,
) => {
  const indent = pIndent + 2

  const functions = model
    ? renderClasses(
        validatorDef(
          'data',
          schemaToFiledsWithMeta(model.schema),
          indent,
          'User',
        ),
        pIndent,
      )
    : null

  const array = EntriesStrict($allow)
  const hasWriteRules = array.some(([op]) => op in allowOptions.write)

  if (hasWriteRules) {
    addValidatorIndex()
    return join('\n\n')([functions])
  } else {
    return ''
  }
}