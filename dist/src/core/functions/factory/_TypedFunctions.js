'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypedFunctions = void 0
const firestore = require('firebase-admin/firestore')
const functions = require('firebase-functions')
const index_js_1 = require('../../constants/index.js')
const _type_js_1 = require('../../utils/_type.js')
const TypedFirestoreTrigger_js_1 = require('./TypedFirestoreTrigger.js')
class TypedFunctions {
  constructor(model, timezone) {
    Object.defineProperty(this, 'model', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: model,
    })
    Object.defineProperty(this, 'timezone', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: timezone,
    })
    Object.defineProperty(this, 'firestoreTrigger', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new TypedFirestoreTrigger_js_1.TypedFirestoreTrigger(
        this.model.schemaOptions,
        firestore,
        functions,
      ),
    })
  }
  callable({ schema: { input, output }, builder, handler }) {
    const wrapped = async (data, context) => {
      const parseResult = input.safeParse(data)
      if (!parseResult.success) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          index_js_1.messages.validationFailed,
        )
      }
      const output = await handler(data, context)
      return output
    }
    return (0, _type_js_1.withType)()(builder.https.onCall(wrapped))
  }
  http({ builder, handler }) {
    return builder.https.onRequest(handler)
  }
  topic(topicName, { builder, handler }) {
    const wrapped = async (message, context) => {
      const input = message.json
      await handler(input, message, context)
    }
    return (0, _type_js_1.withType)()(
      builder.pubsub.topic(topicName).onPublish(wrapped),
    )
  }
  schedule({ builder, schedule, handler, retryConfig = {} }) {
    return builder.pubsub
      .schedule(schedule)
      .timeZone(this.timezone)
      .retryConfig(retryConfig)
      .onRun(handler)
  }
}
exports.TypedFunctions = TypedFunctions
