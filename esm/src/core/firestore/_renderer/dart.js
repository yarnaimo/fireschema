import { EntriesStrict, P } from 'lifts';
import { R } from '../../../lib/fp.js';
import { join } from '../../utils/_string.js';
import { parseSchemaOptions } from './_utils.js';
import { renderEntities } from './entities.js';
const renderFromArray = (parentCollectionName) => (array) => {
    return P(array, R.map(([collectionNameWithDocLabel, { model, allow, ...options }]) => {
        const { functions, collections } = parseSchemaOptions(options);
        const currentCollectionName = parentCollectionName + collectionNameWithDocLabel;
        console.log(currentCollectionName);
        const body = join('\n\n')([
            renderEntities(allow, model, currentCollectionName),
            renderCollectionsForDart(collections, currentCollectionName),
        ]);
        return body;
    }), join('\n\n'));
};
export const renderCollectionsForDart = (collections, parentCollectionName) => {
    return P(collections, EntriesStrict, renderFromArray(parentCollectionName));
};
