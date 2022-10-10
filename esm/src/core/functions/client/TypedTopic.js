export class TypedTopic {
    constructor(pubSubClient) {
        Object.defineProperty(this, "pubSubClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pubSubClient
        });
    }
    async publish(topicName, data, attributes) {
        const messageId = await this.pubSubClient
            .topic(topicName)
            .publishJSON(data, attributes);
        return messageId;
    }
}
