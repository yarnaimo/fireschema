import { EntriesStrict, P } from 'lifts'

import { R } from '../../../lib/fp.js'
import { STypes } from '../../types/index.js'
import { _, join } from '../../utils/_string.js'
import { renderFunctions } from './functions.js'
import { renderRules } from './rules.js'

const renderFromArray =
  (pIndent: number) =>
  (
    array: (readonly [
      string,
      STypes.CollectionOptions.Meta & STypes.CollectionOptions.Children,
    ])[],
  ) => {
    const indent = pIndent + 2

    return P(
      array,
      R.map(
        ([
          collectionNameWithDocLabel,
          { functions, model, allow, ...collections },
        ]) => {
          const body = join('\n\n')([
            functions ? renderFunctions(functions, indent) : null,
            renderRules(allow, model, indent),
            renderCollections(collections, indent),
          ])
          return join('\n')([
            `${_(indent)}match /${collectionNameWithDocLabel} {`,
            body,
            `${_(indent)}}`,
          ])
        },
      ),
      join('\n\n'),
    )
  }

export const renderCollections = (
  collections: STypes.CollectionOptions.Children,
  pIndent: number,
): string | null => {
  return P(collections, EntriesStrict, renderFromArray(pIndent))
}

export const renderCollectionGroups = (
  collections: STypes.CollectionOptions.Children,
  pIndent: number,
): string | null => {
  return P(
    collections,
    EntriesStrict,
    R.map(
      ([collectionPath, options]) =>
        [`{path=**}/${collectionPath}`, options] as const,
    ),
    renderFromArray(pIndent),
  )
}
