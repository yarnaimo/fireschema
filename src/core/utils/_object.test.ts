import { expectType } from 'tsd'
import { getDeepByKey } from './_object'

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

// test('getDeep', () => {
//   const expected = {
//     b: { key: 'value' },
//   }

//   type Expected = {
//     b: { key: string }
//   }

//   const result = getDeep(obj, ['d', 'b', 'c'])

//   expectType<Expected>(result)
//   expect(result).toEqual(expected)
// })

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
  expect(result).toEqual(expected)
})
