import { _fadmin } from '../../lib/functions-types'
import { FunTypes } from '../types/index.js'
import { Subtract } from './_object.js'

export type ParseFP<P extends string> = P extends `${infer P1}-${infer P2}`
  ? [P1, ...ParseFP<P2>]
  : [P]

export type ExtractFP<
  S extends FunTypes.NestedFunctions | undefined,
  D extends number = 5,
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends _fadmin.CloudFunction<any>
        ? K
        : S[K] extends FunTypes.NestedFunctions
        ? `${K}-${ExtractFP<S[K], Subtract[D]>}`
        : never
    }[keyof S & string]

export type GetTopicMeta<
  S extends FunTypes.NestedFunctions | undefined,
  TN extends string,
  D extends number = 5,
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends FunTypes.Topic.Meta<infer N, any>
        ? N extends TN
          ? S[K]
          : never
        : // : S[K] extends FunTypes.NestedFunctions
          // ? GetTopicMeta<S[K], TN, Prev[D]>
          never
    }[keyof S & string]

export type ExtractTopicNames<
  S extends FunTypes.NestedFunctions | undefined,
  D extends number = 5,
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends FunTypes.Topic.Meta<any, any>
        ? S[K]['topicName']
        : // : S[K] extends FunTypes.NestedFunctions
          // ? ExtractTopicNames<S[K], Prev[D]>
          never
    }[keyof S & string]
