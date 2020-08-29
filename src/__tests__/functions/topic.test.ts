import { $topic } from '../_infrastructure/functions-client'

test('topic', async () => {
  const _expectError = async () => {
    // @ts-expect-error: text
    await $topic(['publishMessage'], { text: null })
  }

  const messageId = await $topic(['publishMessage'], { text: 'test' })
  expect(messageId).toEqual(expect.any(String))
})
