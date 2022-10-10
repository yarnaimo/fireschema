import { expectType } from 'tsd'
import { z } from 'zod'
import { _schemaToRule } from '../../core/firestore/_renderer/transformer.js'
import { timestampType } from '../../core/index.js'
const nestedIntersection = z.intersection(
  z.union([z.object({ a: z.string() }), z.object({ a: z.number().int() })]),
  z.object({ b: z.boolean() }),
)
test('types', () => {
  expectType({})
  expectType({})
})
test.each([
  [z.union([z.string(), z.number().int()]), '(data is string || data is int)'],
  [
    z.intersection(z.string(), z.number().int()),
    '(data is string && data is int)',
  ],
  [z.any(), 'true'],
  [z.unknown(), 'true'],
  [z.null(), 'data == null'],
  [z.boolean(), 'data is bool'],
  [z.string(), 'data is string'],
  [
    z.string().min(5).nullable(),
    '((data is string && data.size() >= 5) || data == null)',
  ],
  [z.string().min(5), '(data is string && data.size() >= 5)'],
  [z.string().max(20), '(data is string && data.size() <= 20)'],
  [
    z.string().min(5).max(20),
    '(data is string && data.size() >= 5 && data.size() <= 20)',
  ],
  [
    z.string().regex(/.+@example\.com/),
    '(data is string && data.matches(".+@example\\\\.com"))',
  ],
  [z.literal('a'), 'data == "a"'],
  [z.literal(0), 'data == 0'],
  [z.literal(true), 'data == true'],
  [z.number(), 'data is number'],
  [z.number().int(), 'data is int'],
  [z.number().int().min(5), '(data is int && data >= 5)'],
  [z.number().int().max(20), '(data is int && data <= 20)'],
  [z.number().int().min(5).max(20), '(data is int && data >= 5 && data <= 20)'],
  [timestampType(), 'data is timestamp'],
  [z.string().array(), 'data is list'],
  [z.record(z.string()), 'data is map'],
  [
    z.string().array().min(5).max(20),
    '(data is list && data.size() >= 5 && data.size() <= 20)',
  ],
  [
    z.tuple([z.string(), z.number(), z.object({ a: z.string() })]),
    '(data is list && data[0] is string && data[1] is number && data[2].a is string)',
  ],
  [
    z.object({
      a: z.string(),
      b: z.number().int().optional(),
      c: z.tuple([z.string(), z.number(), z.object({ a: z.string() })]),
    }),
    `(
__validator_keys__(data, ['a', 'b', 'c'])
  && data.a is string
  && (data.b is int || !("b" in data))
  && (data.c is list && data.c[0] is string && data.c[1] is number && data.c[2].a is string)
)`,
  ],
  [
    z.object({ a: z.string(), b: z.undefined() }),
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
  expect(_schemaToRule()(t)).toBe(expected)
})
