import { EntriesStrict, P } from 'lifts';
import { R } from '../../../lib/fp.js';
import { _ } from '../../utils/_string.js';
export const renderFunctions = (functions, pIndent) => {
    const indent = pIndent + 2;
    return P(functions, EntriesStrict, R.map(([key, value]) => [
        `${_(indent)}function ${key} {`,
        `${_(indent)}  ${value.trim()}`,
        `${_(indent)}}`,
    ].join('\n'))).join('\n\n');
};
