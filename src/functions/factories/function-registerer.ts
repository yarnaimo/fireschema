import type {
  EventContext,
  FunctionBuilder,
  https,
  pubsub,
  ScheduleRetryConfig,
} from 'firebase-functions'
import { assertJsonSchema, FunTypes } from '..'
import { GetDeep } from '../../types/_object'
import { getDeep } from '../../utils/_object'
import { $input, messages } from '../constants'
import { FunctionPath, ParseFunctionPath } from '../_types'
import { parseFunctionPath } from '../_utils'

export const initFunctionRegisterer = <S extends FunTypes.SchemaOptions>(
  { https, logger }: typeof import('firebase-functions'),
  schemaOptions: S,
  timezone: string,
) => {
  const callable = <
    FP extends FunctionPath<S['callable']>,
    L extends string[] = ParseFunctionPath<FP>,
    _C = GetDeep<S['callable'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    functionPath: FP,
    {
      builder,
      handler,
    }: {
      builder: FunctionBuilder
      handler: FunTypes.Callable.Handler<C>
    },
  ) => {
    const loc = parseFunctionPath(functionPath)
    const options = getDeep(schemaOptions.callable, loc) as C
    assertJsonSchema(options)
    const inputRuntype = options[$input] as C[typeof $input]

    const wrapped = async (data: unknown, context: https.CallableContext) => {
      const validated = inputRuntype.validate(data)

      if (!validated.success) {
        throw new https.HttpsError('invalid-argument', messages.invalidRequest)
      }

      const output = await handler(validated.value as any, context)
      return output
    }

    const callableFunction = builder.https.onCall(wrapped)
    return callableFunction
  }

  const http = <FP extends FunctionPath<S['http']>>(
    functionPath: FP,
    {
      builder,
      handler,
    }: {
      builder: FunctionBuilder
      handler: FunTypes.Http.Handler
    },
  ) => {
    const onRequestFunction = builder.https.onRequest(handler)
    return onRequestFunction
  }

  const topic = <
    FP extends FunctionPath<S['topic']>,
    L extends string[] = ParseFunctionPath<FP>,
    _C = GetDeep<S['topic'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    functionPath: FP,
    {
      builder,
      handler,
    }: {
      builder: FunctionBuilder
      handler: FunTypes.Topic.Handler<C>
    },
  ) => {
    const wrapped = async (message: pubsub.Message, context: EventContext) => {
      const input = message.json as FunTypes.InputType<C>
      await handler(input, message, context)
    }

    const topicFunction = builder.pubsub.topic(functionPath).onPublish(wrapped)
    return topicFunction
  }

  const schedule = <FP extends FunctionPath<S['schedule']>>(
    functionPath: FP,
    {
      builder,
      schedule,
      handler,
      retryConfig = {},
    }: {
      builder: FunctionBuilder
      schedule: string
      handler: (context: EventContext) => Promise<void>
      retryConfig?: ScheduleRetryConfig
    },
  ) => {
    const scheduleFunction = builder.pubsub
      .schedule(schedule)
      .timeZone(timezone)
      .retryConfig(retryConfig)
      .onRun(handler)

    return scheduleFunction
  }

  return { callable, http, topic, schedule }
}
