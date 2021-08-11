import { $ } from '../../core/index.js'
import { validateJsonSchema } from '../../core/functions/factory/_validator.js'
import { userDataJson } from '../_fixtures/data.js'
import { UserJsonType } from '../_fixtures/firestore-schema.js'

describe('simple types', () => {
  test.each([
    [$.union($.string, $.int), 'a', true],
    [$.union($.string, $.int), 1, true],
    [$.union($.string, $.int), true, false],
    [$.intersection({ a: $.string }, { b: $.int }), { a: 'a', b: 1 }, true],
    [$.intersection({ a: $.string }, { b: $.int }), { a: 'a', b: 'b' }, false],
    [$.intersection({ a: $.string }, { b: $.int }), { a: 'a' }, false],
    [$.unknown, undefined, true],
    [$.unknown, 'a', true],
    [$.unknown, 1, true],
    [$.undefined, undefined, true],
    [$.undefined, null, false],
    [$.undefined, '', false],
    [$.null, null, true],
    [$.null, undefined, false],
    [$.null, '', false],
    [$.bool, true, true],
    [$.bool, false, true],
    [$.bool, 0, false],
    [$.string, '', true],
    [$.string, 0, false],
    [$.literal('a'), 'a', true],
    [$.literal('a'), 'b', false],
    [$.literal(0), 0, true],
    [$.literal(0), 1, false],
    [$.literal(true), true, true],
    [$.literal(true), false, false],
    [$.int, 1, true],
    [$.int, 1.1, false],
    [$.int, true, false],
    [$.float, 1, true],
    [$.float, 1.1, true],
    [$.float, true, false],
    [$.array($.string), ['a', 'b', 'c'], true],
    [$.array($.string), ['a', 'b', 0], false],
    [$.array($.string), 'a', false],
    [{ a: $.string, b: $.int }, { a: 'a', b: 1 }, true],
    [{ a: $.string, b: $.int }, { a: 'a', b: 'b' }, false],
    [{ a: $.string, b: $.int }, { a: 'a', b: 1.1 }, false],
    [{ a: $.string, b: $.optional($.int) }, { a: 'a', b: 1 }, true],
    [{ a: $.string, b: $.optional($.int) }, { a: 'a', b: undefined }, true],
    [{ a: $.string, b: $.optional($.int) }, { a: 'a' }, true],
    [{ a: $.string, b: $.optional($.int) }, { a: 'a', b: null }, false],
    [{ a: $.string, b: $.optional($.int) }, { a: 'a', b: '' }, false],
  ])('%p, %p', (t, value, expected) => {
    expect(validateJsonSchema(t, value)).toBe(expected)
  })
})

describe('UserJsonType', () => {
  const { options, ...userDataJsonWithoutOptions } = userDataJson
  test.each([
    [UserJsonType, userDataJsonWithoutOptions, true],
    [UserJsonType, { ...userDataJson, options: undefined }, true],
    [UserJsonType, { ...userDataJson, age: 20 }, true],
    [UserJsonType, { ...userDataJson, age: '20' }, false],
    [
      UserJsonType,
      {
        ...userDataJson,
        tags: [
          ...userDataJson.tags,
          {
            id: '2',
            name: 'tag2',
          },
        ],
      },
      false,
    ],
  ])('%p, $p', (t, value, expected) => {
    expect(validateJsonSchema(t, value)).toBe(expected)
  })
})

const UserJsonType2 = $.intersection(
  UserJsonType,
  $.union({ a: $.string }, { b: $.int }),
)

describe('UserJsonType2', () => {
  test.each([
    [UserJsonType2, { ...userDataJson, a: 'value' }, true],
    [UserJsonType2, { ...userDataJson, b: 0 }, true],
    [UserJsonType2, { ...userDataJson, c: 'value' }, false],
    [UserJsonType2, { ...userDataJson }, false],
  ])('%p, $p', (t, value, expected) => {
    expect(validateJsonSchema(t, value)).toBe(expected)
  })
})
