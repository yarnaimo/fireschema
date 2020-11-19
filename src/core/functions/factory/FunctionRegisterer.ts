import { _admin } from '../../../lib/firestore-types'
import { _ff } from '../../../lib/functions-types'
import { Type } from '../../../lib/type'
import { messages } from '../../constants'
import { FunTypes, STypes } from '../../types'
import { withType } from '../../utils/_type'
import { FirestoreTriggerRegisterer } from './FirestoreTriggerRegisterer'
import { assertJsonSchema } from './JsonSchema'

export const FunctionRegisterer = <S extends STypes.RootOptions.All>(
  firestoreSchema: S,
  firestoreStatic: typeof _admin,
  functions: typeof import('firebase-functions'),
  timezone: string,
) => {
  const callable = <I extends Type.JsonObject, O extends Type.JsonObject>({
    schema: [inputRuntype, outputRuntype],
    builder,
    handler,
  }: {
    schema: FunTypes.SchemaTuple<I, O>
    builder: _ff.FunctionBuilder
    handler: FunTypes.Callable.Handler<I, O>
  }) => {
    assertJsonSchema(inputRuntype)
    assertJsonSchema(outputRuntype)

    const wrapped = async (
      data: unknown,
      context: _ff.https.CallableContext,
    ) => {
      const validated = inputRuntype.validate(data)

      if (!validated.success) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          messages.invalidRequest,
        )
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
    builder: _ff.FunctionBuilder
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
      builder: _ff.FunctionBuilder
      handler: FunTypes.Topic.Handler<I>
    },
  ) => {
    const wrapped = async (
      message: _ff.pubsub.Message,
      context: _ff.EventContext,
    ) => {
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
    builder: _ff.FunctionBuilder
    schedule: string
    handler: FunTypes.Schedule.Handler
    retryConfig?: _ff.ScheduleRetryConfig
  }) => {
    return builder.pubsub
      .schedule(schedule)
      .timeZone(timezone)
      .retryConfig(retryConfig)
      .onRun(handler)
  }

  const firestoreTrigger = FirestoreTriggerRegisterer(
    firestoreSchema,
    firestoreStatic,
    functions,
  )

  return { callable, http, topic, schedule, firestoreTrigger }
}
