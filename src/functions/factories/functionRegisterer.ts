import {
  EventContext,
  FunctionBuilder,
  https,
  pubsub,
  ScheduleRetryConfig,
} from 'firebase-functions'
import { FunTypes } from '..'
import { STypes } from '../..'
import { Type } from '../../lib/type'
import { withType } from '../../utils/_type'
import { messages } from '../constants'
import { FirestoreTriggerRegisterer } from './firestoreTriggerRegisterer'
import { assertJsonSchema } from './functions-schema'

export const FunctionRegisterer = <S extends STypes.RootOptions.All>(
  firestoreSchema: S,
  { https, logger }: typeof import('firebase-functions'),
  timezone: string,
) => {
  const callable = <I extends Type.JsonObject, O extends Type.JsonObject>({
    schema: [inputRuntype, outputRuntype],
    builder,
    handler,
  }: {
    schema: FunTypes.SchemaTuple<I, O>
    builder: FunctionBuilder
    handler: FunTypes.Callable.Handler<I, O>
  }) => {
    assertJsonSchema(inputRuntype)
    assertJsonSchema(outputRuntype)

    const wrapped = async (data: unknown, context: https.CallableContext) => {
      const validated = inputRuntype.validate(data)

      if (!validated.success) {
        throw new https.HttpsError('invalid-argument', messages.invalidRequest)
      }

      const output = await handler(validated.value as any, context)
      return output
    }

    return withType<FunTypes.Callable.Meta<I, O>>()(
      builder.https.onCall(wrapped),
    )
  }

  const http = ({
    builder,
    handler,
  }: {
    builder: FunctionBuilder
    handler: FunTypes.Http.Handler
  }) => {
    return builder.https.onRequest(handler)
  }

  const topic = <N extends string, I extends Type.JsonObject>(
    topicName: N,
    {
      schema,
      builder,
      handler,
    }: {
      schema: FunTypes.JsonSchema<I>
      builder: FunctionBuilder
      handler: FunTypes.Topic.Handler<I>
    },
  ) => {
    const wrapped = async (message: pubsub.Message, context: EventContext) => {
      const input = message.json as I
      await handler(input, message, context)
    }

    return withType<FunTypes.Topic.Meta<N, I>>()(
      builder.pubsub.topic(topicName).onPublish(wrapped),
    )
  }

  const schedule = ({
    builder,
    schedule,
    handler,
    retryConfig = {},
  }: {
    builder: FunctionBuilder
    schedule: string
    handler: FunTypes.Schedule.Handler
    retryConfig?: ScheduleRetryConfig
  }) => {
    return builder.pubsub
      .schedule(schedule)
      .timeZone(timezone)
      .retryConfig(retryConfig)
      .onRun(handler)
  }

  const firestoreTrigger = FirestoreTriggerRegisterer(firestoreSchema)

  return { callable, http, topic, schedule, firestoreTrigger }
}
