import { EntriesStrict } from 'lifts';
import { allowOptions } from '../../types/index.js';
import { join } from '../../utils/_string.js';
import { addValidatorIndex } from './format_dart.js';
import { schemaToClassWithMeta } from './transformer_dart.js';
export const renderEntities = ($allow, model) => {
    const entities = model ? schemaToClassWithMeta(model.schema, 'User') : null;
    const array = EntriesStrict($allow);
    const hasWriteRules = array.some(([op]) => op in allowOptions.write);
    if (hasWriteRules) {
        addValidatorIndex();
        return join('\n\n')([entities]);
    }
    else {
        return '';
    }
};
