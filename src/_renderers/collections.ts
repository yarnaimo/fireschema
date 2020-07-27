import { EntriesStrict, P } from 'lifts'
import { $allow, $docLabel, $schema } from '../constants/symbols'
import { R } from '../lib/fp'
import { STypes } from '../types/Fireschema'
import { join, _ } from '../utils/_string'
import { renderRules } from './rules'

export const renderCollections = (
  collections: STypes.CollectionOptions.Children,
  pIndent: number,
): string | null => {
  const indent = pIndent + 2

  return P(
    collections,
    EntriesStrict,
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
