import {
  $collectionGroups,
  $functions,
  _createdAt,
  _updatedAt,
} from '../../constants'
import { STypes } from '../../types'
import { $$and, $or, $rule } from '../../utils'
import { join } from '../../utils/_string'
import { renderCollectionGroups, renderCollections } from './collections'
import { validator } from './format'
import { renderFunctions } from './functions'

const metaRules = $$and([
  $or([
    'request.method != "create"',
    $or([
      $rule.notExists(_createdAt, 'data'),
      $rule.isServerTimestamp(`data.${_createdAt}`),
    ]),
  ]),
  $or([
    $rule.notExists(_updatedAt, 'data'),
    $rule.isServerTimestamp(`data.${_updatedAt}`),
  ]),
])

export const renderRoot = (
  $functions: STypes.FunctionsOptions,
  collectionGroups: STypes.CollectionOptions.Children,
  collections: STypes.CollectionOptions.Children,
) => {
  const body = join('\n\n')([
    renderFunctions(
      {
        ...validator('data', metaRules, 4, 'meta'),
        ...$functions,
      },
      2,
    ),
    renderCollectionGroups(collectionGroups, 2),
    renderCollections(collections, 2),
  ])
  return [
    "rules_version = '2';",
    '',
    'service cloud.firestore {',
    '  match /databases/{database}/documents {',
    body,
    '  }',
    '}',
  ]
}

export const renderSchema = <S extends STypes.RootOptions.All>(
  schemaOptions: S,
) => {
  const {
    [$functions]: functions,
    [$collectionGroups]: collectionGroups,
    ...collections
  } = schemaOptions

  const rendered = renderRoot(functions, collectionGroups, collections).join(
    '\n',
  )
  return rendered
}
