import { _fadmin } from '../../lib/functions-types.js'
import { FunTypes } from '../types/index.js'
import { Subtract } from './_object.js'
export declare type ParseFP<P extends string> =
  P extends `${infer P1}-${infer P2}` ? [P1, ...ParseFP<P2>] : [P]
export declare type ExtractFP<
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
export declare type GetTopicMeta<
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
        : never
    }[keyof S & string]
export declare type ExtractTopicNames<
  S extends FunTypes.NestedFunctions | undefined,
  D extends number = 5,
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends FunTypes.Topic.Meta<any, any>
        ? S[K]['topicName']
        : never
    }[keyof S & string]
