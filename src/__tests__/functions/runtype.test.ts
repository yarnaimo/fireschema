import { $jsonSchema } from '../../functions/factories'
import { Type } from '../../lib/type'
import { $ } from '../../runtypes'
import { userDataJson } from '../_fixtures/data'
import { IPostA, IPostB, IUser } from '../_fixtures/firestore-schema'

type IUserJson = Type.Merge<
  IUser,
  {
    timestamp: string
  }
>

const UserJsonRuntype = $.Record({
  name: $.String,
  displayName: $.Null.Or($.String),
  age: $.Number,
  tags: $.Array($.Record({ id: $.Number, name: $.String })),
  options: $.Record({ a: $.Boolean, b: $.String }),
}).And(
  $.Record({
    timestamp: $.String,
  }),
)

const PostRuntype = $.Record({
  type: $.Literal('a'),
  text: $.String,
}).Or(
  $.Record({
    type: $.Literal('b'),
    texts: $.Array($.String),
  }),
)

test('normal', () => {
  const result = $jsonSchema<IUserJson>()

  expect(result.toString()).toBe(UserJsonRuntype.toString())
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

test('union', () => {
  const result = $jsonSchema<IUserJson & ({ a: string } | { b: number })>()

  const expectedA = UserJsonRuntype.And($.Record({ a: $.String }))
  const expectedB = UserJsonRuntype.And($.Record({ b: $.Number }))

  expect(result.toString()).toBe(expectedA.Or(expectedB).toString())
  expect(result.guard({ ...userDataJson, a: 'value' })).toBeTruthy()
  expect(result.guard({ ...userDataJson, b: 0 })).toBeTruthy()
  expect(result.guard({ ...userDataJson, c: 'value' })).toBeFalsy()
  expect(result.guard({ ...userDataJson })).toBeFalsy()
})

test('post', () => {
  const result = $jsonSchema<IPostA | IPostB>()

  expect(result.toString()).toBe(PostRuntype.toString())
})
