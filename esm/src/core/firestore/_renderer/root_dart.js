import { join } from '../../utils/_string.js';
import { parseSchemaOptions } from './_utils.js';
import { renderCollectionsForDart } from './dart.js';
export const renderRoot = (functions, collectionGroups, collections) => {
    const body = join('\n\n')([renderCollectionsForDart(collections, 0)]);
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
