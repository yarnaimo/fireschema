import got from 'got'
import {
  emulatorConfig,
  localhost,
  projectId,
  region,
} from '../_infrastructure/_config.js'

test('http', async () => {
  const resp = await got
    .post(
      `http://${localhost}:${emulatorConfig.functions.port}/${projectId}/${region}/http-getKeys`,
      {
        json: { a: 0, b: '' },
      },
    )
    .json()

  expect(resp).toEqual(['a', 'b'])
})
