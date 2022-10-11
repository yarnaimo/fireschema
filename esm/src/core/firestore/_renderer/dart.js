import { EntriesStrict, P } from 'lifts';
import { R } from '../../../lib/fp.js';
import { _, join } from '../../utils/_string.js';
import { parseSchemaOptions } from './_utils.js';
import { renderEntities } from './entities.js';
const renderFromArray = (pIndent) => (array) => {
    const indent = pIndent + 2;
    return P(array, R.map(([collectionNameWithDocLabel, { model, allow, ...options }]) => {
        const { functions, collections } = parseSchemaOptions(options);
        const body = join('\n\n')([
            renderEntities(allow, model, indent),
            renderCollectionsForDart(collections, indent),
        ]);
        return join('\n')([
            `${_(indent)}match ${collectionNameWithDocLabel} {`,
            body,
            `${_(indent)}}`,
        ]);
    }), join('\n\n'));
};
export const renderCollectionsForDart = (collections, pIndent) => {
    return P(collections, EntriesStrict, renderFromArray(pIndent));
};
