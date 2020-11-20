import { $jsonSchema } from '../../core'
import { Type } from '../../lib/type'
import { $_ } from '../../runtypes'
import { userDataJson } from '../_fixtures/data'
import { IPostA, IPostB, IUser } from '../_fixtures/firestore-schema'

type IUserJson = Type.Merge<
  IUser,
  {
    timestamp: string
  }
>

const UserJsonRuntype = $_.Record({
  name: $_.String,
  displayName: $_.Null.Or($_.String),
  age: $_.Number,
  tags: $_.Array($_.Record({ id: $_.Number, name: $_.String })),
  options: $_.Record({ a: $_.Boolean, b: $_.String }),
}).And(
  $_.Record({
    timestamp: $_.String,
  }),
)

const PostRuntype = $_.Record({
  type: $_.Literal('a'),
  text: $_.String,
}).Or(
  $_.Record({
    type: $_.Literal('b'),
    texts: $_.Array($_.String),
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

  const expectedA = UserJsonRuntype.And($_.Record({ a: $_.String }))
  const expectedB = UserJsonRuntype.And($_.Record({ b: $_.Number }))

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
