import { JsonValue } from 'type-fest'
import {
  OK,
  ParseContext,
  ParseReturnType,
  ZodIntersection,
  ZodObject,
  ZodType,
  ZodUnion,
} from 'zod'

import { FTypes } from './index.js'

export namespace SchemaType {
  export type _DocData =
    | ZodObject<any>
    | ZodUnion<any>
    | ZodIntersection<any, any>
  export type _JsonData = _DocData & { _output: JsonValue }
}

export class ZodTimestamp extends ZodType<FTypes.Timestamp> {
  _parse(
    ctx: ParseContext,
    data: any,
    parsedType: any,
  ): ParseReturnType<FTypes.Timestamp> {
    return OK(data)
  }
}

export const timestampType = () => new ZodTimestamp({})
