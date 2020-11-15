import { $topic } from '../_infrastructure/functions-client'

test('topic', async () => {
  const _expectError = async () => {
    await $topic(
      // @ts-expect-error: invalid path
      '_publishMessage',
      { text: null },
    )

    await $topic(
      'publishMessage',
      // @ts-expect-error: text
      { text: null },
    )
  }

  const messageId = await $topic('publishMessage', { text: 'test' })
  expect(messageId).toEqual(expect.any(String))
})
