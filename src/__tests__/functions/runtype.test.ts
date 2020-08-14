import { schemaToRuntype } from '../../functions/factories'
import { $ } from '../../runtypes'
import { userDataJson } from '../_fixtures/data'
import { UserSchemaJson } from '../_fixtures/firestore-schema'

const UserSchemaJsonA = { ...UserSchemaJson, a: 'string' }
const UserSchemaJsonB = { ...UserSchemaJson, b: 'string' }

const UserRecordJsonBase = {
  name: $.String,
  displayName: $.String.Or($.Null),
  age: $.Number,
  tags: $.Array($.Record({ id: $.Number, name: $.String })),
  timestamp: $.String,
  options: $.Record({ a: $.Boolean, b: $.String }),
}

const UserRecordJson = $.Record(UserRecordJsonBase)
const UserRecordJsonA = $.Record({ ...UserRecordJsonBase, a: $.String })
const UserRecordJsonB = $.Record({ ...UserRecordJsonBase, b: $.String })

test('runtype', () => {
  const result = schemaToRuntype(UserSchemaJson as never)

  expect(result.toString()).toBe(UserRecordJson.toString())
  expect(result.guard(userDataJson)).toBeTruthy()
  expect(
    result.guard({
      ...userDataJson,
      tags: [
        ...userDataJson.tags,
        {
          id: '2',
          name: 'tag2',
        },
      ],
    }),
  ).toBeFalsy()
})

test('runtype array', () => {
  const result = schemaToRuntype([UserSchemaJsonA, UserSchemaJsonB] as never)

  expect(result.toString()).toBe(UserRecordJsonA.Or(UserRecordJsonB).toString())
  expect(result.guard({ ...userDataJson, a: 'value' })).toBeTruthy()
  expect(result.guard({ ...userDataJson, b: 'value' })).toBeTruthy()
  expect(result.guard({ ...userDataJson, c: 'value' })).toBeFalsy()
})
