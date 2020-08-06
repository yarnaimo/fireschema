import dayjs from 'dayjs'
import { expectType } from 'tsd'
import { messages } from '../../functions'
import { $call } from '../_infrastructure/functions-client'

const userData = {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: dayjs().toISOString(),
  tags: ['tag0', 'tag1'],
}

test('call', async () => {
  const result = await $call(['createUser'], userData)

  expect(result.isOk).toBeTruthy()
  expect(result.valueOrError).toEqual({ result: userData.age ** 2 })
  if (result.isOk) {
    expectType<{ result: number }>(result.valueOrError)
  }
})

test('call - invalid-argument', async () => {
  const result = await $call(['createUser'], {
    ...userData,
    // @ts-expect-error
    age: '16',
  })

  expect(result.isOk).toBeFalsy()
  expect(result.valueOrError).toMatchObject({
    message: messages.invalidRequest,
    code: 'invalid-argument',
  })
})

test('call - out-of-range', async () => {
  const result = await $call(['createUser'], {
    ...userData,
    age: -1,
  })

  expect(result.isOk).toBeFalsy()
  expect(result.valueOrError).toMatchObject({
    message: expect.any(String),
    code: 'out-of-range',
  })
})

test('call - internal', async () => {
  const result = await $call(['createUser'], {
    ...userData,
    age: 100,
  })

  expect(result.isOk).toBeFalsy()
  expect(result.valueOrError).toMatchObject({
    message: messages.unknown,
    code: 'internal',
  })
})
