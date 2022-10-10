import * as firestore from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { messages } from '../../constants/index.js';
import { withType } from '../../utils/_type.js';
import { TypedFirestoreTrigger } from './TypedFirestoreTrigger.js';
export class TypedFunctions {
    constructor(model, timezone) {
        this.model = model;
        this.timezone = timezone;
        this.firestoreTrigger = new TypedFirestoreTrigger(this.model.schemaOptions, firestore, functions);
    }
    callable({ schema: { input, output }, builder, handler, }) {
        const wrapped = async (data, context) => {
            const parseResult = input.safeParse(data);
            if (!parseResult.success) {
                throw new functions.https.HttpsError('invalid-argument', messages.validationFailed);
            }
            const output = await handler(data, context);
            return output;
        };
        return withType()(builder.https.onCall(wrapped));
    }
    http({ builder, handler, }) {
        return builder.https.onRequest(handler);
    }
    topic(topicName, { builder, handler, }) {
        const wrapped = async (message, context) => {
            const input = message.json;
            await handler(input, message, context);
        };
        return withType()(builder.pubsub.topic(topicName).onPublish(wrapped));
    }
    schedule({ builder, schedule, handler, retryConfig = {}, }) {
        return builder.pubsub
            .schedule(schedule)
            .timeZone(this.timezone)
            .retryConfig(retryConfig)
            .onRun(handler);
    }
}
