import { STypes } from '../../types/index.js'
import { join } from '../../utils/_string.js'
import { FirestoreModel } from '../model.js'
import { parseSchemaOptions } from './_utils.js'
import { renderCollectionsForDart } from './dart.js'

export const renderRoot = (
  functions: STypes.FunctionsRenderOptions,
  collectionGroups: STypes.CollectionOptions.GroupChildren,
  collections: STypes.CollectionOptions.Children,
) => {
  const body = join('\n\n')([renderCollectionsForDart(collections, 0)])

  return [
    "rules_version = '1000';",
    '',
    'service cloud.firestore {',
    '  match /databases/{database}/documents {',
    body,
    '  }',
    '}',
  ]
}

export const renderSchema = <S extends STypes.RootOptions.All>({
  schemaOptions: { collectionGroups, ...options },
}: FirestoreModel<S>) => {
  const { functions, collections } = parseSchemaOptions(options)

  const rendered = renderRoot(functions, collectionGroups, collections).join(
    '\n',
  )
  return rendered
}
