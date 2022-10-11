import { parseSchemaOptions } from './_utils.js';
import { renderCollectionsForDart } from './dart.js';
export const renderRoot = (functions, collectionGroups, collections) => {
    const body = renderCollectionsForDart(collections);
    return [
        "import 'package:cloud_firestore/cloud_firestore.dart';\n",
        "import 'package:freezed_annotation/freezed_annotation.dart';\n",
        "part 'fireschema.freezed.dart';\n",
        "part 'fireschema.g.dart';\n\n",
        body,
    ].join('');
};
export const renderSchema = ({ schemaOptions: { collectionGroups, ...options }, }) => {
    const { functions, collections } = parseSchemaOptions(options);
    const rendered = renderRoot(functions, collectionGroups, collections);
    return rendered;
};
