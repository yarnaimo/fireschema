'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypedTopic = void 0
class TypedTopic {
  constructor(pubSubClient) {
    Object.defineProperty(this, 'pubSubClient', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: pubSubClient,
    })
  }
  async publish(topicName, data, attributes) {
    const messageId = await this.pubSubClient
      .topic(topicName)
      .publishJSON(data, attributes)
    return messageId
  }
}
exports.TypedTopic = TypedTopic
