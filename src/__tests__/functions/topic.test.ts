import { typedTopic } from '../_infrastructure/functions-client'

test('topic', async () => {
  !(async () => {
    await typedTopic.publish(
      // @ts-expect-error: invalid path
      'publishMessage',
      { text: null },
    )

    await typedTopic.publish(
      'publish_message',
      // @ts-expect-error: text
      { text: null },
    )
  })

  const messageId = await typedTopic.publish('publish_message', {
    text: 'test',
  })
  expect(messageId).toEqual(expect.any(String))
})
