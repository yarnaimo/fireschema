"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsd_1 = require("tsd");
const zod_1 = require("zod");
const transformer_js_1 = require("../../core/firestore/_renderer/transformer.js");
const index_js_1 = require("../../core/index.js");
const nestedIntersection = zod_1.z.intersection(zod_1.z.union([zod_1.z.object({ a: zod_1.z.string() }), zod_1.z.object({ a: zod_1.z.number().int() })]), zod_1.z.object({ b: zod_1.z.boolean() }));
test('types', () => {
    (0, tsd_1.expectType)({});
    (0, tsd_1.expectType)({});
});
test.each([
    [zod_1.z.union([zod_1.z.string(), zod_1.z.number().int()]), '(data is string || data is int)'],
    [
        zod_1.z.intersection(zod_1.z.string(), zod_1.z.number().int()),
        '(data is string && data is int)',
    ],
    [zod_1.z.any(), 'true'],
    [zod_1.z.unknown(), 'true'],
    [zod_1.z.null(), 'data == null'],
    [zod_1.z.boolean(), 'data is bool'],
    [zod_1.z.string(), 'data is string'],
    [
        zod_1.z.string().min(5).nullable(),
        '((data is string && data.size() >= 5) || data == null)',
    ],
    [zod_1.z.string().min(5), '(data is string && data.size() >= 5)'],
    [zod_1.z.string().max(20), '(data is string && data.size() <= 20)'],
    [
        zod_1.z.string().min(5).max(20),
        '(data is string && data.size() >= 5 && data.size() <= 20)',
    ],
    [
        zod_1.z.string().regex(/.+@example\.com/),
        '(data is string && data.matches(".+@example\\\\.com"))',
    ],
    [zod_1.z.literal('a'), 'data == "a"'],
    [zod_1.z.literal(0), 'data == 0'],
    [zod_1.z.literal(true), 'data == true'],
    [zod_1.z.number(), 'data is number'],
    [zod_1.z.number().int(), 'data is int'],
    [zod_1.z.number().int().min(5), '(data is int && data >= 5)'],
    [zod_1.z.number().int().max(20), '(data is int && data <= 20)'],
    [zod_1.z.number().int().min(5).max(20), '(data is int && data >= 5 && data <= 20)'],
    [(0, index_js_1.timestampType)(), 'data is timestamp'],
    [zod_1.z.string().array(), 'data is list'],
    [zod_1.z.record(zod_1.z.string()), 'data is map'],
    [
        zod_1.z.string().array().min(5).max(20),
        '(data is list && data.size() >= 5 && data.size() <= 20)',
    ],
    [
        zod_1.z.tuple([zod_1.z.string(), zod_1.z.number(), zod_1.z.object({ a: zod_1.z.string() })]),
        '(data is list && data[0] is string && data[1] is number && data[2].a is string)',
    ],
    [
        zod_1.z.object({
            a: zod_1.z.string(),
            b: zod_1.z.number().int().optional(),
            c: zod_1.z.tuple([zod_1.z.string(), zod_1.z.number(), zod_1.z.object({ a: zod_1.z.string() })]),
        }),
        `(
__validator_keys__(data, ['a', 'b', 'c'])
  && data.a is string
  && (data.b is int || !("b" in data))
  && (data.c is list && data.c[0] is string && data.c[1] is number && data.c[2].a is string)
)`,
    ],
    [
        zod_1.z.object({ a: zod_1.z.string(), b: zod_1.z.undefined() }),
        `(
__validator_keys__(data, ['a', 'b'])
  && data.a is string
  && !("b" in data)
)`,
    ],
    [
        nestedIntersection,
        `(((
__validator_keys__(data, ['a'])
  && data.a is string
) || (
__validator_keys__(data, ['a'])
  && data.a is int
)) && (
__validator_keys__(data, ['b'])
  && data.b is bool
))`,
    ],
])('%i %p', (t, expected) => {
    expect((0, transformer_js_1._schemaToRule)()(t)).toBe(expected);
});
