import type { Attributes, PubSub } from '@google-cloud/pubsub'
import { $input } from '../../constants'
import { FunTypes } from '../../types'
import { ExtractTopicNames, GetTopicMeta } from '../../types/_functions'

export const TopicClient = <M extends FunTypes.FunctionsModule>(
  pubSubClient: PubSub,
) => {
  const publish = async <
    TN extends ExtractTopicNames<M['topic']>,
    C extends GetTopicMeta<M['topic'], TN> = GetTopicMeta<M['topic'], TN>
  >(
    topicName: TN,
    data: C[typeof $input],
    attributes?: Attributes,
  ) => {
    const messageId = await pubSubClient
      .topic(topicName)
      .publishJSON(data as object, attributes)

    return messageId
  }

  return publish
}
