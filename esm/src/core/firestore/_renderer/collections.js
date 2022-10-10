import { EntriesStrict, P } from 'lifts';
import { R } from '../../../lib/fp.js';
import { _, join } from '../../utils/_string.js';
import { parseSchemaOptions } from './_utils.js';
import { renderFunctions } from './functions.js';
import { renderRules } from './rules.js';
const renderFromArray = (pIndent) => (array) => {
    const indent = pIndent + 2;
    return P(array, R.map(([collectionNameWithDocLabel, { model, allow, ...options }]) => {
        const { functions, collections } = parseSchemaOptions(options);
        const body = join('\n\n')([
            functions ? renderFunctions(functions, indent) : null,
            renderRules(allow, model, indent),
            renderCollections(collections, indent),
        ]);
        return join('\n')([
            `${_(indent)}match ${collectionNameWithDocLabel} {`,
            body,
            `${_(indent)}}`,
        ]);
    }), join('\n\n'));
};
export const renderCollections = (collections, pIndent) => {
    return P(collections, EntriesStrict, renderFromArray(pIndent));
};
export const renderCollectionGroups = (collections, pIndent) => {
    return P(collections, EntriesStrict, R.map(([collectionPath, options]) => [`/{path=**}${collectionPath}`, options]), renderFromArray(pIndent));
};
