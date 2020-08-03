import type { Attributes, PubSub } from '@google-cloud/pubsub'
import { FunTypes } from '..'
import { GetDeep, Loc } from '../../types/_object'

export const initTopicClient = <S extends FunTypes.SchemaOptions>(
  pubSubClient: PubSub,
  schemaOptions: S,
) => {
  const publish = async <
    L extends Loc<S['topic']>,
    _C = GetDeep<S['topic'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    loc: L,
    data: FunTypes.InputType<C>,
    attributes?: Attributes,
  ) => {
    const name = loc.join('-')

    const messageId = await pubSubClient
      .topic(name)
      .publishJSON(data, attributes)

    return messageId
  }

  return publish
}
