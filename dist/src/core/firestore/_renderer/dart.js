"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCollectionsForDart = void 0;
const lifts_1 = require("lifts");
const fp_js_1 = require("../../../lib/fp.js");
const _string_js_1 = require("../../utils/_string.js");
const _utils_js_1 = require("./_utils.js");
const entities_js_1 = require("./entities.js");
const renderFromArray = (pIndent) => (array) => {
    const indent = pIndent + 2;
    return (0, lifts_1.P)(array, fp_js_1.R.map(([collectionNameWithDocLabel, { model, allow, ...options }]) => {
        const { functions, collections } = (0, _utils_js_1.parseSchemaOptions)(options);
        const body = (0, _string_js_1.join)('\n\n')([
            (0, entities_js_1.renderEntities)(allow, model, indent),
            (0, exports.renderCollectionsForDart)(collections, indent),
        ]);
        return (0, _string_js_1.join)('\n')([
            `${(0, _string_js_1._)(indent)}match ${collectionNameWithDocLabel} {`,
            body,
            `${(0, _string_js_1._)(indent)}}`,
        ]);
    }), (0, _string_js_1.join)('\n\n'));
};
const renderCollectionsForDart = (collections, pIndent) => {
    return (0, lifts_1.P)(collections, lifts_1.EntriesStrict, renderFromArray(pIndent));
};
exports.renderCollectionsForDart = renderCollectionsForDart;
