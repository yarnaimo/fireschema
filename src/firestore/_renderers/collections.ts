import { EntriesStrict, P } from 'lifts'
import { R } from '../../lib/fp'
import { join, _ } from '../../utils/_string'
import { $allow, $docLabel, $schema } from '../constants'
import { STypes } from '../Fireschema'
import { renderRules } from './rules'

const renderFromArray = (pIndent: number) => (
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
        collectionPath,
        {
          [$schema]: schema,
          [$docLabel]: docLabel,
          [$allow]: allow,
          ...collections
        },
      ]) => {
        const body = join('\n\n')([
          renderRules(allow, schema, indent),
          renderCollections(collections, indent),
        ])
        return join('\n')([
          `${_(indent)}match /${collectionPath}/{${docLabel}} {`,
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
