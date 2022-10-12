import { EntriesStrict } from 'lifts'

import { STypes, allowOptions } from '../../types/index.js'
import { join } from '../../utils/_string.js'
import { DataModel } from '../model.js'
import { addValidatorIndex } from './format_dart.js'
import { schemaToClassWithMeta } from './transformer_dart.js'

export const renderEntities = (
  $allow: STypes.AllowOptions,
  model: DataModel<any, any, any> | undefined,
  collectionPath: string,
) => {
  const entities = model
    ? schemaToClassWithMeta(
        model.schema,
        model.modelName ?? 'UNDEFINED',
        collectionPath,
      )
    : null

  const array = EntriesStrict($allow)
  const hasWriteRules = array.some(([op]) => op in allowOptions.write)

  if (hasWriteRules) {
    addValidatorIndex()
    return join('\n\n')([entities])
  } else {
    return ''
  }
}
