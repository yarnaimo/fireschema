import { parseSchemaOptions } from './_utils.js';
import { renderCollectionsForDart } from './dart.js';
export const renderRoot = (functions, collectionGroups, collections) => {
    const body = renderCollectionsForDart(collections);
    return body;
};
export const renderSchema = ({ schemaOptions: { collectionGroups, ...options }, }) => {
    const { functions, collections } = parseSchemaOptions(options);
    const rendered = renderRoot(functions, collectionGroups, collections);
    return rendered;
};
