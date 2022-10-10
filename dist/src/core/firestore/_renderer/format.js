"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorDef = exports.validatorCall = exports.addValidatorIndex = void 0;
const _string_js_1 = require("../../utils/_string.js");
let validatorIndex = 0;
const addValidatorIndex = () => {
    validatorIndex++;
};
exports.addValidatorIndex = addValidatorIndex;
const format = (rulesString, indent) => {
    return rulesString
        .split('\n')
        .map((line, i, arr) => {
        return i === 0
            ? line
            : i === arr.length - 1 || line === ') || (' || line === ') && ('
                ? `${(0, _string_js_1._)(indent + 2)}${line}`
                : `${(0, _string_js_1._)(indent + 4)}${line}`;
    })
        .join('\n');
};
const validatorCall = (arg, label) => `__validator_${label || validatorIndex}__(${arg})`;
exports.validatorCall = validatorCall;
const validatorDef = (arg, rulesString, indent, label) => ({
    [(0, exports.validatorCall)(arg, label)]: `
    return ${format(rulesString, indent)};
  `,
});
exports.validatorDef = validatorDef;
