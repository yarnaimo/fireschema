import { $collectionGroups, $functions } from '../constants'
import { STypes } from '../types/Fireschema'
import { renderCollectionGroups, renderCollections } from './collections'
import { renderFunctions } from './functions'

export const renderRoot = (
  $functions: STypes.FunctionsOptions,
  collectionGroups: STypes.CollectionOptions.Children,
  collections: STypes.CollectionOptions.Children,
) => {
  return [
    "rules_version = '2';",
    '',
    'service cloud.firestore {',
    '  match /databases/{database}/documents {',
    renderFunctions($functions, 2),
    '',
    renderCollectionGroups(collectionGroups, 2),
    '',
    renderCollections(collections, 2),
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
