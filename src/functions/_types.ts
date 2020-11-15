import { FunTypes } from "."
import { Prev } from "../types/_object"

export type ParseFunctionPath<P extends string> =
  P extends `${infer P1}-${infer P2}`
    ? [P1, ...ParseFunctionPath<P2>]
    : [P]

export type FunctionPath<
  S extends FunTypes.NestedOptions,
  D extends number = 10
> = [D] extends [never]
  ? never
  : {
      [K in keyof S & string]: S[K] extends FunTypes.IO<any, any>
        ? K
        : `${K}-${FunctionPath<S[K], Prev[D]>}`
    }[keyof S & string]
