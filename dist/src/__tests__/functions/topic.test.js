"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_client_js_1 = require("../_services/functions-client.js");
test('topic', async () => {
    !(async () => {
        await functions_client_js_1.typedTopic.publish(
        // @ts-expect-error: invalid path
        'publishMessage', { text: null });
        await functions_client_js_1.typedTopic.publish('publish_message', 
        // @ts-expect-error: text
        { text: null });
    });
    const messageId = await functions_client_js_1.typedTopic.publish('publish_message', {
        text: 'test',
    });
    expect(messageId).toEqual(expect.any(String));
});
