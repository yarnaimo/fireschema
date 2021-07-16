import { $ } from '../../core'
import { schemaToRule } from '../../core/firestore/_renderer/transformer'

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
__validator_meta__(data)
  && data.a is string
  && (data.b is int || !("b" in data))
)`,
  ],
  [
    { a: $.string, b: $.undefined },
    `(
__validator_meta__(data)
  && data.a is string
  && !("b" in data)
)`,
  ],
])('%p', (t, expected) => {
  expect(schemaToRule()(t)).toBe(expected)
})
