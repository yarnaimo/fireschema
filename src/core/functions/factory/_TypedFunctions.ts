import * as firestore from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { z } from 'zod'

import { _fadmin } from '../../../lib/functions-types.js'
import { messages } from '../../constants/index.js'
import { FirestoreModel, InferFirestoreModelS } from '../../firestore/index.js'
import { FunTypes, STypes, SchemaType } from '../../types/index.js'
import { withType } from '../../utils/_type.js'
import { TypedFirestoreTrigger } from './TypedFirestoreTrigger.js'

export class TypedFunctions<
  M extends FirestoreModel<STypes.RootOptions.All>,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> {
  constructor(readonly model: M, readonly timezone: string) {}

  firestoreTrigger = new TypedFirestoreTrigger(
    this.model.schemaOptions as S,
    firestore,
    functions,
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
    handler: FunTypes.Callable.Handler<z.infer<SI>, z.infer<SO>>
  }) {
    const wrapped = async (
      data: unknown,
      context: _fadmin.https.CallableContext,
    ) => {
      const parseResult = input.safeParse(data)

      if (!parseResult.success) {
        throw new functions.https.HttpsError(
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
      handler: FunTypes.Topic.Handler<z.infer<S>>
    },
  ) {
    const wrapped = async (
      message: _fadmin.pubsub.Message,
      context: _fadmin.EventContext,
    ) => {
      const input = message.json as z.infer<S>
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
