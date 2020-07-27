import { EntriesStrict, P } from 'lifts'
import { R } from '../lib/fp'
import { STypes } from '../types/Fireschema'
import { _ } from '../utils/_string'

export const renderFunctions = (
  $functions: STypes.FunctionsOptions,
  pIndent: number,
) => {
  const indent = pIndent + 2

  return P(
    $functions,
    EntriesStrict,
    R.map(([key, value]) =>
      [
        `${_(indent)}function ${key} {`,
        `${_(indent)}  ${value.trim()}`,
        `${_(indent)}}`,
      ].join('\n'),
    ),
  ).join('\n\n')
}
