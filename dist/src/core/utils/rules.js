"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const fp_js_1 = require("../../lib/fp.js");
const $join = (separator, newline = false) => (...conditions) => {
    const uniqConditions = fp_js_1.R.uniq(conditions);
    return uniqConditions.length === 0
        ? 'true'
        : uniqConditions.length === 1
            ? uniqConditions.join(separator)
            : newline
                ? `(\n${uniqConditions.join(separator)}\n)`
                : `(${uniqConditions.join(separator)})`;
};
exports.rules = {
    or: $join(' || '),
    and: $join(' && '),
    orMultiline: $join('\n  || ', true),
    andMultiline: $join('\n  && ', true),
    basePath: '/databases/$(database)/documents',
};
