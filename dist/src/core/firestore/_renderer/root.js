'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.renderSchema = exports.renderRoot = void 0
const index_js_1 = require('../../constants/index.js')
const _string_js_1 = require('../../utils/_string.js')
const index_js_2 = require('../../utils/index.js')
const _utils_js_1 = require('./_utils.js')
const collections_js_1 = require('./collections.js')
const format_js_1 = require('./format.js')
const functions_js_1 = require('./functions.js')
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
const metaRules = index_js_2.rules.orMultiline(
  index_js_2.rules.and(
    'request.method == "create"',
    `data.${index_js_1._createdAt} == request.time`,
    `data.${index_js_1._updatedAt} == request.time`,
  ),
  index_js_2.rules.and(
    'request.method == "update"',
    `data.${index_js_1._createdAt} == resource.data.${index_js_1._createdAt}`,
    `data.${index_js_1._updatedAt} == request.time`,
  ),
)
const keysRules = `data.keys().removeAll(['${index_js_1._createdAt}', '${index_js_1._updatedAt}']).hasOnly(keys)`
const renderRoot = (functions, collectionGroups, collections) => {
  const body = (0, _string_js_1.join)('\n\n')([
    (0, functions_js_1.renderFunctions)(
      {
        ...(0, format_js_1.validatorDef)('data', metaRules, 4, 'meta'),
        ...(0, format_js_1.validatorDef)('data, keys', keysRules, 4, 'keys'),
        ...functions,
      },
      2,
    ),
    (0, collections_js_1.renderCollectionGroups)(collectionGroups, 2),
    (0, collections_js_1.renderCollections)(collections, 2),
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
exports.renderRoot = renderRoot
const renderSchema = ({ schemaOptions: { collectionGroups, ...options } }) => {
  const { functions, collections } = (0, _utils_js_1.parseSchemaOptions)(
    options,
  )
  const rendered = (0, exports.renderRoot)(
    functions,
    collectionGroups,
    collections,
  ).join('\n')
  return rendered
}
exports.renderSchema = renderSchema
