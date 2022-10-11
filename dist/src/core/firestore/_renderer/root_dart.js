"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSchema = exports.renderRoot = void 0;
const _string_js_1 = require("../../utils/_string.js");
const _utils_js_1 = require("./_utils.js");
const dart_js_1 = require("./dart.js");
const renderRoot = (functions, collectionGroups, collections) => {
    const body = (0, _string_js_1.join)('\n\n')([(0, dart_js_1.renderCollectionsForDart)(collections, 0)]);
    return [
        "rules_version = '1000';",
        '',
        'service cloud.firestore {',
        '  match /databases/{database}/documents {',
        body,
        '  }',
        '}',
    ];
};
exports.renderRoot = renderRoot;
const renderSchema = ({ schemaOptions: { collectionGroups, ...options }, }) => {
    const { functions, collections } = (0, _utils_js_1.parseSchemaOptions)(options);
    const rendered = (0, exports.renderRoot)(functions, collectionGroups, collections).join('\n');
    return rendered;
};
exports.renderSchema = renderSchema;
