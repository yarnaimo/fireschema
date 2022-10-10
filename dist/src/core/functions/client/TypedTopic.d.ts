import { z } from 'zod'
import { ExtractTopicNames, GetTopicMeta } from '../../types/_functions.js'
import { FunTypes } from '../../types/index.js'
import type { Attributes, PubSub } from '@google-cloud/pubsub'
export declare class TypedTopic<M extends FunTypes.FunctionsModule> {
  readonly pubSubClient: PubSub
  constructor(pubSubClient: PubSub)
  publish<
    TN extends ExtractTopicNames<M['topic']>,
    C extends GetTopicMeta<M['topic'], TN> = GetTopicMeta<M['topic'], TN>,
  >(
    topicName: TN,
    data: z.infer<C['input']>,
    attributes?: Attributes,
  ): Promise<string>
}
