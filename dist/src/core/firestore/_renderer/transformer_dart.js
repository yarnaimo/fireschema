"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._schemaToOptional = exports._schemaToField = exports.schemaToFiledsWithMeta = void 0;
const zod_1 = require("zod");
const SchemaType_js_1 = require("../../types/SchemaType.js");
const schemaToFiledsWithMeta = (t) => {
    return Object.entries(t.shape)
        .map(([key, _t]) => {
        return `final ${(0, exports._schemaToField)(_t)} ${key};`;
    })
        .join('\n');
};
exports.schemaToFiledsWithMeta = schemaToFiledsWithMeta;
const _schemaToField = (t) => {
    if (t instanceof zod_1.ZodOptional) {
        return `${(0, exports._schemaToField)(t.unwrap()).replace('?', '')}?`;
    }
    if (t instanceof zod_1.ZodNullable) {
        return `${(0, exports._schemaToField)(t.unwrap()).replace('?', '')}?`;
    }
    if (t instanceof zod_1.ZodAny)
        return `any`;
    if (t instanceof zod_1.ZodUnknown)
        return `any`;
    if (t instanceof zod_1.ZodBoolean)
        return `bool`;
    if (t instanceof SchemaType_js_1.ZodTimestamp)
        return `Timestamp`;
    if (t instanceof zod_1.ZodString)
        return `String`;
    if (t instanceof zod_1.ZodRecord)
        return `error`;
    if (t instanceof zod_1.ZodIntersection)
        return `error`;
    if (t instanceof zod_1.ZodUndefined)
        return `error`;
    if (t instanceof zod_1.ZodNull)
        return `error`;
    if (t instanceof zod_1.ZodLiteral)
        return `error`;
    if (t instanceof zod_1.ZodUnion)
        return `error`;
    if (t instanceof zod_1.ZodTuple)
        return `error`;
    if (t instanceof zod_1.ZodNumber) {
        return t.isInt ? `int` : `double`;
    }
    if (t instanceof zod_1.ZodArray)
        return `List<dynamic>`;
    if (t instanceof zod_1.ZodObject) {
        return '';
    }
    throw new Error(`unhandled type ${t.constructor.name} at`);
};
exports._schemaToField = _schemaToField;
const _schemaToOptional = (t) => {
    return '';
};
exports._schemaToOptional = _schemaToOptional;
