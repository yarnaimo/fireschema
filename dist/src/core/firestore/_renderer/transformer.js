"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._schemaToRule = exports.schemaToRuleWithMeta = void 0;
const lifts_1 = require("lifts");
const zod_1 = require("zod");
const type_js_1 = require("../../../lib/type.js");
const SchemaType_js_1 = require("../../types/SchemaType.js");
const index_js_1 = require("../../utils/index.js");
const schemaToRuleWithMeta = (t) => {
    return index_js_1.rules.and(`__validator_meta__(data)`, (0, exports._schemaToRule)()(t));
};
exports.schemaToRuleWithMeta = schemaToRuleWithMeta;
const _schemaToRule = (parent = null, key = 'data') => (t) => {
    const name = type_js_1.is.null_(parent)
        ? key
        : type_js_1.is.number(key)
            ? `${parent}[${key}]`
            : `${parent}.${key}`;
    if (t instanceof zod_1.ZodUnion)
        return index_js_1.rules.or(...t.options.map((0, exports._schemaToRule)(parent, key)));
    if (t instanceof zod_1.ZodIntersection)
        return index_js_1.rules.and(...[t._def.left, t._def.right].map((0, exports._schemaToRule)(parent, key)));
    if (t instanceof zod_1.ZodOptional)
        return (0, exports._schemaToRule)(parent, key)(zod_1.z.union([t.unwrap(), zod_1.z.undefined()]));
    if (t instanceof zod_1.ZodNullable)
        return (0, exports._schemaToRule)(parent, key)(zod_1.z.union([t.unwrap(), zod_1.z.null()]));
    if (t instanceof zod_1.ZodAny)
        return `true`;
    if (t instanceof zod_1.ZodUnknown)
        return `true`;
    if (t instanceof zod_1.ZodUndefined)
        return `!("${key}" in ${parent})`;
    if (t instanceof zod_1.ZodNull)
        return `${name} == null`;
    if (t instanceof zod_1.ZodBoolean)
        return `${name} is bool`;
    if (t instanceof zod_1.ZodLiteral)
        return `${name} == ${JSON.stringify(t.value)}`;
    if (t instanceof SchemaType_js_1.ZodTimestamp)
        return `${name} is timestamp`;
    if (t instanceof zod_1.ZodRecord)
        return `${name} is map`;
    if (t instanceof zod_1.ZodString) {
        return index_js_1.rules.and(`${name} is string`, ...t._def.checks.flatMap((c) => {
            return c.kind === 'min'
                ? [`${name}.size() >= ${c.value}`]
                : c.kind === 'max'
                    ? [`${name}.size() <= ${c.value}`]
                    : c.kind === 'regex'
                        ? [`${name}.matches(${JSON.stringify(c.regex.source)})`]
                        : [];
        }));
    }
    if (t instanceof zod_1.ZodNumber) {
        return index_js_1.rules.and(t.isInt ? `${name} is int` : `${name} is number`, ...t._def.checks.flatMap((c) => {
            return c.kind === 'min'
                ? [`${name} >= ${c.value}`]
                : c.kind === 'max'
                    ? [`${name} <= ${c.value}`]
                    : [];
        }));
    }
    if (t instanceof zod_1.ZodArray) {
        const { minLength: min, maxLength: max } = t._def;
        // const isEmpty = `${name}.size() == 0`
        return index_js_1.rules.and(`${name} is list`, 
        // $or([isEmpty, _schemaToRule(name, 0)(t.element)]),
        ...[
            min && `${name}.size() >= ${min.value}`,
            max && `${name}.size() <= ${max.value}`,
        ].filter(type_js_1.is.string));
    }
    if (t instanceof zod_1.ZodTuple) {
        return index_js_1.rules.and(`${name} is list`, ...t.items.map((_t, i) => {
            return (0, exports._schemaToRule)(name, i)(_t);
        }));
    }
    if (t instanceof zod_1.ZodObject) {
        return (name === 'data' ? index_js_1.rules.andMultiline : index_js_1.rules.and)(...(0, lifts_1.P)(Object.entries(t.shape).map(([key, _t]) => {
            return (0, exports._schemaToRule)(name, key)(_t);
        }), (rules) => {
            if (name !== 'data') {
                return rules;
            }
            const keysArray = `[${Object.keys(t.shape)
                .map((k) => `'${k}'`)
                .join(', ')}]`;
            return [`__validator_keys__(data, ${keysArray})`, ...rules];
        }));
    }
    throw new Error(`unhandled type ${t.constructor.name} at ${name}`);
};
exports._schemaToRule = _schemaToRule;
