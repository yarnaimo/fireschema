import type { Attributes, PubSub } from '@google-cloud/pubsub'
import { z } from 'zod'
import { $input } from '../../constants/index.js'
import { FunTypes } from '../../types/index.js'
import { ExtractTopicNames, GetTopicMeta } from '../../types/_functions.js'

export class TypedTopic<M extends FunTypes.FunctionsModule> {
  constructor(readonly pubSubClient: PubSub) {}

  async publish<
    TN extends ExtractTopicNames<M['topic']>,
    C extends GetTopicMeta<M['topic'], TN> = GetTopicMeta<M['topic'], TN>,
  >(topicName: TN, data: z.infer<C[typeof $input]>, attributes?: Attributes) {
    const messageId = await this.pubSubClient
      .topic(topicName)
      .publishJSON(data as object, attributes)

    return messageId
  }
}
