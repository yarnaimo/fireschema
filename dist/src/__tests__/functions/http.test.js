'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const got_1 = require('got')
const emulator_js_1 = require('../_services/emulator.js')
test('http', async () => {
  const resp = await got_1.default
    .post(
      `http://${emulator_js_1.localhost}:${emulator_js_1.emulators.functions.port}/${emulator_js_1.projectId}/${emulator_js_1.region}/http-getKeys`,
      {
        json: { a: 0, b: '' },
      },
    )
    .json()
  expect(resp).toEqual(['a', 'b'])
})
