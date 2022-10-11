"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEntities = void 0;
const lifts_1 = require("lifts");
const index_js_1 = require("../../types/index.js");
const _string_js_1 = require("../../utils/_string.js");
const format_dart_js_1 = require("./format_dart.js");
const transformer_dart_js_1 = require("./transformer_dart.js");
const renderEntities = ($allow, model) => {
    const entities = model ? (0, transformer_dart_js_1.schemaToClassWithMeta)(model.schema, 'User') : null;
    const array = (0, lifts_1.EntriesStrict)($allow);
    const hasWriteRules = array.some(([op]) => op in index_js_1.allowOptions.write);
    if (hasWriteRules) {
        (0, format_dart_js_1.addValidatorIndex)();
        return (0, _string_js_1.join)('\n\n')([entities]);
    }
    else {
        return '';
    }
};
exports.renderEntities = renderEntities;
