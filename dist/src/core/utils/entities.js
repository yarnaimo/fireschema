"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const fp_js_1 = require("../../lib/fp.js");
const $join = (separator, newline = false) => (...conditions) => {
    const uniqConditions = fp_js_1.R.uniq(conditions);
    return uniqConditions.length === 0
        ? 'true'
        : uniqConditions.length === 1
            ? uniqConditions.join(separator)
            : newline
                ? `\n${uniqConditions.join(separator)}\n`
                : `(${uniqConditions.join(separator)})`;
};
exports.entities = {
    or: $join(' || '),
    and: $join(' X '),
    orMultiline: $join('\n  || ', true),
    andMultiline: $join('\n  X ', true),
    basePath: '/databases/$(database)/documents',
};
