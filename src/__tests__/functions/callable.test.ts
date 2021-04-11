import { expectType } from 'tsd'
import { messages } from '../../core'
import { userDataJson } from '../_fixtures/data'
import { typedCaller } from '../_infrastructure/functions-client'

!(async () => {
  await typedCaller.call(
    // @ts-expect-error invalid path
    '_createUser',
    userDataJson,
  )
})

test('call', async () => {
  const result = await typedCaller.call('createUser', userDataJson)

  expect(result).toEqual({
    data: { result: userDataJson.age ** 2 },
  })
  if (!result.error) {
    expectType<{ result: number }>(result.data)
  }
})

test('call - nested', async () => {
  const result = await typedCaller.call('nested-toUpperCase', { text: 'text' })

  expect(result).toEqual({
    data: { result: 'TEXT' },
  })
  if (!result.error) {
    expectType<{ result: string }>(result.data)
  }
})

test('call - invalid-argument', async () => {
  const result = await typedCaller.call('createUser', {
    ...userDataJson,
    // @ts-expect-error: age
    age: '16',
  })

  expect(result).toEqual({
    error: expect.objectContaining({
      message: messages.invalidRequest,
      code: 'invalid-argument',
    }),
  })
})

test('call - out-of-range', async () => {
  const result = await typedCaller.call('createUser', {
    ...userDataJson,
    age: -1,
  })

  expect(result).toEqual({
    error: expect.objectContaining({
      message: expect.any(String),
      code: 'out-of-range',
    }),
  })
})

test('call - internal', async () => {
  const result = await typedCaller.call('createUser', {
    ...userDataJson,
    age: 100,
  })

  expect(result).toEqual({
    error: expect.objectContaining({
      message: messages.unknown,
      code: 'internal',
    }),
  })
})
