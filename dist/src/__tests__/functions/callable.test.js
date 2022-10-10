'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tsd_1 = require('tsd')
const index_js_1 = require('../../core/index.js')
const data_js_1 = require('../_fixtures/data.js')
const functions_client_js_1 = require('../_services/functions-client.js')
!(async () => {
  await functions_client_js_1.typedCaller.call(
    // @ts-expect-error invalid path
    '_createUser',
    data_js_1.userDataJson,
  )
})
test('call', async () => {
  const result = await functions_client_js_1.typedCaller.call(
    'createUser',
    data_js_1.userDataJson,
  )
  expect(result).toEqual({
    data: { result: data_js_1.userDataJson.age ** 2 },
  })
  if (!result.error) {
    ;(0, tsd_1.expectType)(result.data)
  }
})
test('call - nested', async () => {
  const result = await functions_client_js_1.typedCaller.call(
    'nested-toUpperCase',
    { text: 'text' },
  )
  expect(result).toEqual({
    data: { result: 'TEXT' },
  })
  if (result.error) {
    ;(0, tsd_1.expectType)('functions/failed-precondition')
  } else {
    ;(0, tsd_1.expectType)(result.data)
  }
})
test('call - invalid-argument', async () => {
  const result = await functions_client_js_1.typedCaller.call('createUser', {
    ...data_js_1.userDataJson,
    // @ts-expect-error: age
    age: '16',
  })
  expect(result).toEqual({
    error: expect.objectContaining({
      message: index_js_1.messages.validationFailed,
      code: 'functions/invalid-argument',
    }),
  })
})
test('call - out-of-range', async () => {
  const result = await functions_client_js_1.typedCaller.call('createUser', {
    ...data_js_1.userDataJson,
    age: -1,
  })
  expect(result).toEqual({
    error: expect.objectContaining({
      message: expect.any(String),
      code: 'functions/out-of-range',
    }),
  })
})
test('call - internal', async () => {
  const result = await functions_client_js_1.typedCaller.call('createUser', {
    ...data_js_1.userDataJson,
    age: 100,
  })
  expect(result).toEqual({
    error: expect.objectContaining({
      message: index_js_1.messages.unknown,
      code: 'functions/internal',
    }),
  })
})
