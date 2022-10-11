import { ZodAny, ZodArray, ZodBoolean, ZodIntersection, ZodLiteral, ZodNull, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodRecord, ZodString, ZodTuple, ZodUndefined, ZodUnion, ZodUnknown, } from 'zod';
import { ZodTimestamp } from '../../types/SchemaType.js';
export const schemaToFiledsWithMeta = (t) => {
    return Object.entries(t.shape)
        .map(([key, _t]) => {
        return `final ${_schemaToField(_t)} ${key};`;
    })
        .join('\n');
};
export const _schemaToField = (t) => {
    if (t instanceof ZodOptional) {
        return `${_schemaToField(t.unwrap()).replace('?', '')}?`;
    }
    if (t instanceof ZodNullable) {
        return `${_schemaToField(t.unwrap()).replace('?', '')}?`;
    }
    if (t instanceof ZodAny)
        return `any`;
    if (t instanceof ZodUnknown)
        return `any`;
    if (t instanceof ZodBoolean)
        return `bool`;
    if (t instanceof ZodTimestamp)
        return `Timestamp`;
    if (t instanceof ZodString)
        return `String`;
    if (t instanceof ZodRecord)
        return `error`;
    if (t instanceof ZodIntersection)
        return `error`;
    if (t instanceof ZodUndefined)
        return `error`;
    if (t instanceof ZodNull)
        return `error`;
    if (t instanceof ZodLiteral)
        return `error`;
    if (t instanceof ZodUnion)
        return `error`;
    if (t instanceof ZodTuple)
        return `error`;
    if (t instanceof ZodNumber) {
        return t.isInt ? `int` : `double`;
    }
    if (t instanceof ZodArray)
        return `List<dynamic>`;
    if (t instanceof ZodObject) {
        return '';
    }
    throw new Error(`unhandled type ${t.constructor.name} at`);
};
export const _schemaToOptional = (t) => {
    return '';
};
