import { Fireschema } from '../types'
import { renderCollections } from './collections'
import { renderFunctions } from './functions'

export const renderRoot = (
  $functions: Fireschema.FunctionsOptions,
  collections: Fireschema.CollectionOptions.Children,
) => {
  return [
    "rules_version = '2';",
    '',
    'service cloud.firestore {',
    '  match /databases/{database}/documents {',
    renderFunctions($functions, 2),
    '',
    renderCollections(collections, 2),
    '  }',
    '}',
  ]
}
