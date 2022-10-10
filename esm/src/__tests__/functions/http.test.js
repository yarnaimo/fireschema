import got from 'got'
import {
  emulators,
  localhost,
  projectId,
  region,
} from '../_services/emulator.js'
test('http', async () => {
  const resp = await got
    .post(
      `http://${localhost}:${emulators.functions.port}/${projectId}/${region}/http-getKeys`,
      {
        json: { a: 0, b: '' },
      },
    )
    .json()
  expect(resp).toEqual(['a', 'b'])
})
