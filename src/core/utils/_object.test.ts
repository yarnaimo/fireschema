import { expectType } from 'tsd'
import {
  getByLoc,
  getDeep,
  getDeepByKey,
  getLastSegment,
  joinLoc,
  omitLastSegment,
} from './_object'

const obj = {
  a: {
    b: {
      c: { key: 'value' },
    },
  },
  d: {
    b: {
      c: {
        b: { key: 'value' },
      },
    },
  },
}

test('getDeep', () => {
  const result = getDeep(obj, ['d', 'b', 'c'])
  expect(result).toEqual(obj.d.b.c)
})

test('getByLoc', () => {
  const result = getByLoc(obj, 'd.b.c')
  expect(result).toEqual(obj.d.b.c)
})

test('getDeepByKey', () => {
  const expected = [
    {
      c: {
        key: 'value',
      },
    },
    {
      c: {
        b: { key: 'value' },
      },
    },
    { key: 'value' },
  ]

  type Expected = (
    | {
        c: {
          key: string
        }
      }
    | {
        c: {
          b: { key: string }
        }
      }
    | { key: string }
  )[]

  const result = getDeepByKey(obj, 'b')

  expectType<Expected>(result)
  // @ts-expect-error: error
  expectType<Expected[number]>(result)

  expect(result).toEqual(expected)
})

test('joinLoc', () => {
  const result = joinLoc('a.b', 'c')

  expectType<'a.b.c'>(result)
  // @ts-expect-error: error
  expectType<'a.b'>(result)

  expect(result).toBe('a.b.c')
})

test('getLastSegment', () => {
  const result = getLastSegment('a.b.c')

  expect(result).toBe('c')
})

test('omitLastSegment', () => {
  const result = omitLastSegment('a.b.c')

  expectType<'a.b'>(result)
  // @ts-expect-error: error
  expectType<'a.b.c'>(result)

  expect(result).toBe('a.b')
})
