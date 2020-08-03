import type {
  EventContext,
  FunctionBuilder,
  https,
  pubsub,
} from 'firebase-functions'
import { FunTypes } from '..'
import { t } from '../../lib/type'
import { GetDeep, Loc } from '../../types/_object'
import { getDeep } from '../../utils/_object'
import { $input, messages } from '../constants'

export const initFunctionRegisterer = <S extends FunTypes.SchemaOptions>(
  { https, logger }: typeof import('firebase-functions'),
  schemaOptions: S,
) => {
  const callable = <
    L extends Loc<S['callable']>,
    _C = GetDeep<S['callable'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    loc: L,
    builder: FunctionBuilder,
    handler: FunTypes.Callable.Handler<C>,
  ) => {
    const options = (getDeep(schemaOptions.callable, loc) as any) as C
    const input = options[$input] as C[typeof $input]
    const inputSchema = t.Record(input)

    const wrapped = async (data: unknown, context: https.CallableContext) => {
      const validated = inputSchema.validate(data)

      if (!validated.success) {
        throw new https.HttpsError('invalid-argument', messages.invalidRequest)
      }

      const output = await handler(validated.value, context)
      return output
    }

    const callableFunction = builder.https.onCall(wrapped)

    return Object.assign(callableFunction, { handler })
  }

  const topic = <
    L extends Loc<S['topic']>,
    _C = GetDeep<S['topic'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    loc: L,
    builder: FunctionBuilder,
    handler: FunTypes.Topic.Handler<C>,
  ) => {
    const options = (getDeep(schemaOptions.topic, loc) as any) as C
    const input = options[$input] as C[typeof $input]

    const wrapped = async (message: pubsub.Message, context: EventContext) => {
      const input = message.json as FunTypes.RecordStaticType<C[typeof $input]>
      await handler(input, message, context)
    }

    const name = loc.join('-')
    const topicFunction = builder.pubsub.topic(name).onPublish(wrapped)

    return Object.assign(topicFunction, { handler })
  }

  return { callable, topic }
}
