import type { Attributes, PubSub } from '@google-cloud/pubsub'
import { FunTypes } from '..'
import { GetDeep } from '../../types/_object'
import { FunctionPath, ParseFunctionPath } from '../_types'

export const initTopicClient = <S extends FunTypes.SchemaOptions>(
  pubSubClient: PubSub,
  schemaOptions: S,
) => {
  const publish = async <
    FP extends FunctionPath<S['topic']>,
    L extends string[] = ParseFunctionPath<FP>,
    _C = GetDeep<S['topic'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    functionPath: FP,
    data: FunTypes.InputType<C>,
    attributes?: Attributes,
  ) => {
    const messageId = await pubSubClient
      .topic(functionPath)
      .publishJSON(data as object, attributes)

    return messageId
  }

  return publish
}
