import { _createdAt, _updatedAt } from '../../constants/index.js';
import { join } from '../../utils/_string.js';
import { parseSchemaOptions } from './_utils.js';
import { renderCollectionGroups, renderCollections } from './collections.js';
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
const keysRules = `data.keys().removeAll(['${_createdAt}', '${_updatedAt}']).hasOnly(keys)`;
export const renderRoot = (functions, collectionGroups, collections) => {
    const body = join('\n\n')([
        renderCollectionGroups(collectionGroups, 2),
        renderCollections(collections, 2),
    ]);
    return [
        "rules_version = '1000';",
        '',
        'service cloud.firestore {',
        '  match /databases/{database}/documents {',
        body,
        '  }',
        '}',
    ];
};
export const renderSchema = ({ schemaOptions: { collectionGroups, ...options }, }) => {
    const { functions, collections } = parseSchemaOptions(options);
    const rendered = renderRoot(functions, collectionGroups, collections).join('\n');
    return rendered;
};
