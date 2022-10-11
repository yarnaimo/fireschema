"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSchema = exports.renderRoot = void 0;
const _utils_js_1 = require("./_utils.js");
const dart_js_1 = require("./dart.js");
const renderRoot = (functions, collectionGroups, collections) => {
    const body = (0, dart_js_1.renderCollectionsForDart)(collections);
    return body;
};
exports.renderRoot = renderRoot;
const renderSchema = ({ schemaOptions: { collectionGroups, ...options }, }) => {
    const { functions, collections } = (0, _utils_js_1.parseSchemaOptions)(options);
    const rendered = (0, exports.renderRoot)(functions, collectionGroups, collections);
    return rendered;
};
exports.renderSchema = renderSchema;
