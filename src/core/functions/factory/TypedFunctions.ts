import { _admin } from '../../../lib/firestore-types'
import { _fadmin } from '../../../lib/functions-types'
import { Type } from '../../../lib/type'
import { messages } from '../../constants'
import { FunTypes, STypes } from '../../types'
import { withType } from '../../utils/_type'
import { assertJsonSchema } from './JsonSchema'
import { TypedFirestoreTrigger } from './TypedFirestoreTrigger'

export class TypedFunctions<S extends STypes.RootOptions.All> {
  constructor(
    readonly firestoreSchema: S,
    readonly firestoreStatic: typeof _admin,
    readonly functions: typeof import('firebase-functions'),
    readonly timezone: string,
  ) {}

  firestoreTrigger = new TypedFirestoreTrigger(
    this.firestoreSchema,
    this.firestoreStatic,
    this.functions,
  )

  callable<I extends Type.JsonObject, O extends Type.JsonObject>({
    schema: [inputRuntype, outputRuntype],
    builder,
    handler,
  }: {
    schema: FunTypes.SchemaTuple<I, O>
    builder: _fadmin.FunctionBuilder
    handler: FunTypes.Callable.Handler<I, O>
  }) {
    assertJsonSchema(inputRuntype)
    assertJsonSchema(outputRuntype)

    const wrapped = async (
      data: unknown,
      context: _fadmin.https.CallableContext,
    ) => {
      const validated = inputRuntype.validate(data)

      if (!validated.success) {
        throw new this.functions.https.HttpsError(
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

  http({
    builder,
    handler,
  }: {
    builder: _fadmin.FunctionBuilder
    handler: FunTypes.Http.Handler
  }) {
    return builder.https.onRequest(handler)
  }

  topic<N extends string, I extends Type.JsonObject>(
    topicName: N,
    {
      schema,
      builder,
      handler,
    }: {
      schema: FunTypes.JsonSchema<I>
      builder: _fadmin.FunctionBuilder
      handler: FunTypes.Topic.Handler<I>
    },
  ) {
    const wrapped = async (
      message: _fadmin.pubsub.Message,
      context: _fadmin.EventContext,
    ) => {
      const input = message.json as I
      await handler(input, message, context)
    }

    return withType<FunTypes.Topic.Meta<N, I>>()(
      builder.pubsub.topic(topicName).onPublish(wrapped),
    )
  }

  schedule({
    builder,
    schedule,
    handler,
    retryConfig = {},
  }: {
    builder: _fadmin.FunctionBuilder
    schedule: string
    handler: FunTypes.Schedule.Handler
    retryConfig?: _fadmin.ScheduleRetryConfig
  }) {
    return builder.pubsub
      .schedule(schedule)
      .timeZone(this.timezone)
      .retryConfig(retryConfig)
      .onRun(handler)
  }
}
