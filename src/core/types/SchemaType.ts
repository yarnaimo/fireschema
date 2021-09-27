import { JsonValue } from 'type-fest'
import {
  OK,
  ParseContext,
  ParseReturnType,
  z,
  ZodIntersection,
  ZodObject,
  ZodType,
  ZodTypeAny,
  ZodUnion,
} from 'zod'
import { FTypes } from './index.js'

export const $type = Symbol('Fireschema - schema type')

export type InferSchemaType<T extends ZodTypeAny> = z.infer<T>

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
