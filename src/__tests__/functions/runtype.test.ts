import { schemaToRuntype } from '../../functions/factories'
import { $ } from '../../runtypes'
import { userDataJson } from '../_fixtures/data'
import { UserSchema } from '../_fixtures/firestore-schema'

test('runtype', () => {
  const result = schemaToRuntype({
    ...UserSchema,
    timestamp: 'string',
  } as never)

  const expected = $.Record({
    name: $.String,
    displayName: $.String.Or($.Null),
    age: $.Number,
    tags: $.Array($.Record({ id: $.Number, name: $.String })),
    timestamp: $.String,
    options: $.Record({ a: $.Boolean, b: $.String }),
  })

  expect(result.toString()).toBe(expected.toString())
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
