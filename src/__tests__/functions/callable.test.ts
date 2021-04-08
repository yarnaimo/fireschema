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

  expect(result.isOk).toBeTruthy()
  expect(result.valueOrError).toEqual({ result: userDataJson.age ** 2 })
  if (result.isOk) {
    expectType<{ result: number }>(result.valueOrError)
  }
})

test('call - nested', async () => {
  const result = await typedCaller.call('nested-toUpperCase', { text: 'text' })

  expect(result.isOk).toBeTruthy()
  expect(result.valueOrError).toEqual({ result: 'TEXT' })
  if (result.isOk) {
    expectType<{ result: string }>(result.valueOrError)
  }
})

test('call - invalid-argument', async () => {
  const result = await typedCaller.call('createUser', {
    ...userDataJson,
    // @ts-expect-error: age
    age: '16',
  })

  expect(result.isOk).toBeFalsy()
  expect(result.valueOrError).toMatchObject({
    message: messages.invalidRequest,
    code: 'invalid-argument',
  })
})

test('call - out-of-range', async () => {
  const result = await typedCaller.call('createUser', {
    ...userDataJson,
    age: -1,
  })

  expect(result.isOk).toBeFalsy()
  expect(result.valueOrError).toMatchObject({
    message: expect.any(String),
    code: 'out-of-range',
  })
})

test('call - internal', async () => {
  const result = await typedCaller.call('createUser', {
    ...userDataJson,
    age: 100,
  })

  expect(result.isOk).toBeFalsy()
  expect(result.valueOrError).toMatchObject({
    message: messages.unknown,
    code: 'internal',
  })
})
