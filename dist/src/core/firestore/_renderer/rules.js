"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRules = void 0;
const lifts_1 = require("lifts");
const fp_js_1 = require("../../../lib/fp.js");
const index_js_1 = require("../../types/index.js");
const _string_js_1 = require("../../utils/_string.js");
const index_js_2 = require("../../utils/index.js");
const format_js_1 = require("./format.js");
const functions_js_1 = require("./functions.js");
const transformer_js_1 = require("./transformer.js");
const renderRules = ($allow, model, pIndent) => {
    const indent = pIndent + 2;
    const functions = model
        ? (0, functions_js_1.renderFunctions)((0, format_js_1.validatorDef)('data', (0, transformer_js_1.schemaToRuleWithMeta)(model.schema), indent), pIndent)
        : null;
    const array = (0, lifts_1.EntriesStrict)($allow);
    const hasWriteRules = array.some(([op]) => op in index_js_1.allowOptions.write);
    const rulesStr = (0, lifts_1.P)(array, fp_js_1.R.map(([op, condition]) => {
        if (op in index_js_1.allowOptions.write && op !== 'delete') {
            return [
                op,
                index_js_2.rules.and(condition, (0, format_js_1.validatorCall)('request.resource.data')),
            ];
        }
        return [op, condition];
    }), fp_js_1.R.map(([op, condition]) => {
        return `${(0, _string_js_1._)(indent)}allow ${op}: if ${condition};`;
    }), (0, _string_js_1.join)('\n'));
    if (hasWriteRules) {
        (0, format_js_1.addValidatorIndex)();
        return (0, _string_js_1.join)('\n\n')([functions, rulesStr]);
    }
    else {
        return rulesStr;
    }
};
exports.renderRules = renderRules;
