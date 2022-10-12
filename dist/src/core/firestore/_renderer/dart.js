"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCollectionsForDart = void 0;
const lifts_1 = require("lifts");
const fp_js_1 = require("../../../lib/fp.js");
const _string_js_1 = require("../../utils/_string.js");
const _utils_js_1 = require("./_utils.js");
const entities_js_1 = require("./entities.js");
const renderFromArray = (parentCollectionName) => (array) => {
    return (0, lifts_1.P)(array, fp_js_1.R.map(([collectionNameWithDocLabel, { model, allow, ...options }]) => {
        const { functions, collections } = (0, _utils_js_1.parseSchemaOptions)(options);
        const currentCollectionName = parentCollectionName + collectionNameWithDocLabel;
        console.log(currentCollectionName);
        const body = (0, _string_js_1.join)('\n\n')([
            (0, entities_js_1.renderEntities)(allow, model, currentCollectionName),
            (0, exports.renderCollectionsForDart)(collections, currentCollectionName),
        ]);
        return body;
    }), (0, _string_js_1.join)('\n\n'));
};
const renderCollectionsForDart = (collections, parentCollectionName) => {
    return (0, lifts_1.P)(collections, lifts_1.EntriesStrict, renderFromArray(parentCollectionName));
};
exports.renderCollectionsForDart = renderCollectionsForDart;
