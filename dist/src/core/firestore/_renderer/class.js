"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderClasses = void 0;
const lifts_1 = require("lifts");
const fp_js_1 = require("../../../lib/fp.js");
const _string_js_1 = require("../../utils/_string.js");
const renderClasses = (classes, pIndent) => {
    const indent = pIndent + 2;
    return (0, lifts_1.P)(classes, lifts_1.EntriesStrict, fp_js_1.R.map(([key, value]) => [
        `${(0, _string_js_1._)(indent)}class ${key} {`,
        `${(0, _string_js_1._)(indent)}  ${value.trim()}`,
        `${(0, _string_js_1._)(indent)}}`,
    ].join('\n'))).join('\n\n');
};
exports.renderClasses = renderClasses;
