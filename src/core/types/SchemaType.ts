import { JsonValue } from 'type-fest'
import {
  OK,
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
  _parse(input: any): ParseReturnType<FTypes.Timestamp> {
    const { ctx } = this._processInputParams(input)
    return OK(ctx.data)
  }
}

export const timestampType = () => new ZodTimestamp({})
