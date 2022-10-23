import { _createdAt, _updatedAt } from '../../constants/index.js'
import { STypes } from '../../types/index.js'
import { join } from '../../utils/_string.js'
import { rules } from '../../utils/index.js'
import { FirestoreModel } from '../model.js'
import { parseSchemaOptions } from './_utils.js'
import { renderCollectionGroups, renderCollections } from './collections.js'
import { validatorDef } from './format.js'
import { renderFunctions } from './functions.js'

/**
 * - TypedDocumentRef.prototype.create() は内部で set() に渡すデータに _createdAt フィールドを自動で追加する
 * - create() でもドキュメントが既に存在する場合は method が update になる
 * - => id の衝突などで意図せず上書きされようとした場合、method は update で、_createdAt は書き込み前後で変化する
 * - => method が update の場合に _createdAt が変化していないのをチェックすると防げる
 *
 * **Rules**
 * - create
 *   - data._createdAt is server timestamp
 *   - data._updatedAt is server timestamp
 * - update
 *   - data._createdAt not changed
 *   - data._updatedAt is server timestamp
 */

const keysRules = `data.keys().removeAll(['${_createdAt}', '${_updatedAt}']).hasOnly(keys)`

export const renderRoot = (
  functions: STypes.FunctionsRenderOptions,
  collectionGroups: STypes.CollectionOptions.GroupChildren,
  collections: STypes.CollectionOptions.Children,
) => {
  const body = join('\n\n')([
    renderFunctions(
      {
        ...validatorDef('data, keys', keysRules, 4, 'keys'),
        ...functions,
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

export const renderSchema = <S extends STypes.RootOptions.All>({
  schemaOptions: { collectionGroups, ...options },
}: FirestoreModel<S>) => {
  const { functions, collections } = parseSchemaOptions(options)

  const rendered = renderRoot(functions, collectionGroups, collections).join(
    '\n',
  )
  return rendered
}
