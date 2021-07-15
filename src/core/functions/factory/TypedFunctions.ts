import { _admin } from '../../../lib/firestore-types'
import { _fadmin } from '../../../lib/functions-types'
import { messages } from '../../constants'
import { FirestoreModel, InferFirestoreModelS } from '../../firestore'
import { FunTypes, InferSchemaType, SchemaType, STypes } from '../../types'
import { withType } from '../../utils/_type'
import { TypedFirestoreTrigger } from './TypedFirestoreTrigger'
import { validateJsonSchema } from './_validator'

export class TypedFunctions<
  M extends FirestoreModel<STypes.RootOptions.All>,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> {
  constructor(
    readonly model: M,
    readonly firestoreStatic: typeof _admin,
    readonly functions: typeof import('firebase-functions'),
    readonly timezone: string,
  ) {}

  firestoreTrigger = new TypedFirestoreTrigger(
    this.model.schemaOptions as S,
    this.firestoreStatic,
    this.functions,
  )

  callable<SI extends SchemaType._JsonData, SO extends SchemaType._JsonData>({
    schema: { input, output },
    builder,
    handler,
  }: {
    schema: {
      input: SI
      output: SO
    }
    builder: _fadmin.FunctionBuilder
    handler: FunTypes.Callable.Handler<InferSchemaType<SI>, InferSchemaType<SO>>
  }) {
    const wrapped = async (
      data: unknown,
      context: _fadmin.https.CallableContext,
    ) => {
      const valid = validateJsonSchema(input, data)

      if (!valid) {
        throw new this.functions.https.HttpsError(
          'invalid-argument',
          messages.validationFailed,
        )
      }

      const output = await handler(data as any, context)
      return output
    }

    return withType<FunTypes.Callable.Meta<SI, SO>>()(
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

  topic<N extends string, S extends SchemaType._JsonData>(
    topicName: N,
    {
      builder,
      handler,
    }: {
      schema: S
      builder: _fadmin.FunctionBuilder
      handler: FunTypes.Topic.Handler<InferSchemaType<S>>
    },
  ) {
    const wrapped = async (
      message: _fadmin.pubsub.Message,
      context: _fadmin.EventContext,
    ) => {
      const input = message.json as InferSchemaType<S>
      await handler(input, message, context)
    }

    return withType<FunTypes.Topic.Meta<N, S>>()(
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
