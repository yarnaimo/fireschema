import { $topic } from '../_infrastructure/functions-client'

test('topic', async () => {
  !(async () => {
    await $topic(
      // @ts-expect-error: invalid path
      'publishMessage',
      { text: null },
    )

    await $topic(
      'publish_message',
      // @ts-expect-error: text
      { text: null },
    )
  })

  const messageId = await $topic('publish_message', { text: 'test' })
  expect(messageId).toEqual(expect.any(String))
})
