import { EntriesStrict, P } from 'lifts'

import { R } from '../../../lib/fp.js'
import { STypes } from '../../types/index.js'
import { _ } from '../../utils/_string.js'

export const renderClasses = (
  classes: STypes.FunctionsRenderOptions,
  pIndent: number,
) => {
  const indent = pIndent + 2

  return P(
    classes,
    EntriesStrict,
    R.map(([key, value]) =>
      [
        `${_(indent)}class ${key} {`,
        `${_(indent)}  ${value.trim()}`,
        `${_(indent)}}`,
      ].join('\n'),
    ),
  ).join('\n\n')
}