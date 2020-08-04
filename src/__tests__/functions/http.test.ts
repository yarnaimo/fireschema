import got from 'got'
import { emulatorOrigin, projectId, region } from '../_infrastructure/_config'

test('http', async () => {
  const resp = await got
    .post(`${emulatorOrigin.functions}/${projectId}/${region}/http-getKeys`, {
      json: { a: 0, b: '' },
    })
    .json()

  expect(resp).toEqual(['a', 'b'])
})
