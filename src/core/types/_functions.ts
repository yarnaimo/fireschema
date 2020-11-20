import { _ff } from '../../lib/functions-types'
import { $topicName } from '../constants'
import { FunTypes } from '../types'
import { Prev } from './_object'

export type ParseFunctionPath<P extends string> =
  P extends `${infer P1}-${infer P2}`
    ? [P1, ...ParseFunctionPath<P2>]
    : [P]

export type ExtractFunctionPaths<
  S extends FunTypes.NestedFunctions,
  D extends number = 5
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends _ff.CloudFunction<any>
        ? K
        : S[K] extends FunTypes.NestedFunctions
        ? `${K}-${ExtractFunctionPaths<S[K], Prev[D]>}`
        : never
    }[keyof S & string]

export type GetTopicMeta<
  S extends FunTypes.NestedFunctions,
  TN extends string,
  D extends number = 5
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends FunTypes.Topic.Meta<infer N, any>
        ? N extends TN
          ? S[K]
          : never
        // : S[K] extends FunTypes.NestedFunctions
        // ? GetTopicMeta<S[K], TN, Prev[D]>
        : never
    }[keyof S & string]

export type ExtractTopicNames<
  S extends FunTypes.NestedFunctions,
  D extends number = 5
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends FunTypes.Topic.Meta<any, any>
        ? S[K][typeof $topicName]
        // : S[K] extends FunTypes.NestedFunctions
        // ? ExtractTopicNames<S[K], Prev[D]>
        : never
    }[keyof S & string]
