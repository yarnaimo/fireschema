export class TypedTopic {
  constructor(pubSubClient) {
    this.pubSubClient = pubSubClient
  }
  async publish(topicName, data, attributes) {
    const messageId = await this.pubSubClient
      .topic(topicName)
      .publishJSON(data, attributes)
    return messageId
  }
}
