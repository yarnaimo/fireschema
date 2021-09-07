import { expectType } from 'tsd'
import { _schemaToRule } from '../../core/firestore/_renderer/transformer.js'
import { $, InferSchemaType } from '../../core/index.js'

const nestedIntersection = $.intersection(
  $.union({ a: $.string }, { a: $.int }),
  { b: $.bool },
)

test('types', () => {
  type Result = InferSchemaType<typeof nestedIntersection>
  type Expected = ({ a: string } | { a: number }) & { b: boolean }

  expectType<Expected>({} as Result)
  expectType<Result>({} as Expected)
})

test.each([
  [$.union($.string, $.int), '(data is string || data is int)'],
  [$.intersection($.string, $.int), '(data is string && data is int)'],
  [$.unknown, 'true'],
  [$.null, 'data == null'],
  [$.bool, 'data is bool'],
  [$.string, 'data is string'],
  [$.literal('a'), 'data == "a"'],
  [$.literal(0), 'data == 0'],
  [$.literal(true), 'data == true'],
  [$.int, 'data is int'],
  [$.float, 'data is float'],
  [$.timestamp, 'data is timestamp'],
  [$.array($.string), '(data.size() == 0 || data[0] is string)'],
  [
    { a: $.string, b: $.optional($.int) },
    `(
data.a is string
  && (data.b is int || !("b" in data))
)`,
  ],
  [
    { a: $.string, b: $.undefined },
    `(
data.a is string
  && !("b" in data)
)`,
  ],
  [
    nestedIntersection,
    `((data.a is string || data.a is int) && data.b is bool)`,
  ],
])('%p', (t, expected) => {
  expect(_schemaToRule()(t)).toBe(expected)
})
