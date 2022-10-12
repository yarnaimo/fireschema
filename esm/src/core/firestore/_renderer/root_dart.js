import { parseSchemaOptions } from './_utils.js';
import { renderCollectionsForDart } from './dart.js';
export const renderRoot = (functions, collectionGroups, collections) => {
    const body = renderCollectionsForDart(collections, '');
    return [
        "import 'fireschema_export.dart';",
        '',
        "part 'fireschema.freezed.dart';",
        "part 'fireschema.g.dart';\n",
        body,
    ].join('\n');
};
export const renderSchema = ({ schemaOptions: { collectionGroups, ...options }, }) => {
    const { functions, collections } = parseSchemaOptions(options);
    const rendered = renderRoot(functions, collectionGroups, collections);
    return rendered;
};
