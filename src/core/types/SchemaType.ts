import { UnionToIntersection } from 'type-fest'
import { FTypes } from '.'
import { Subtract } from './_object'

export namespace SchemaType {
  export type _LiteralType = string | number | boolean

  export type Union<T extends Value[]> = { type: 'union'; valueTypes: T }
  export type UnionJson<T extends JsonValue[]> = Union<T>
  export type Intersection<T extends Value[]> = {
    type: 'intersection'
    valueTypes: T
  }
  export type IntersectionJson<T extends JsonValue[]> = Intersection<T>

  export type Unknown = { type: 'unknown' }
  export type Undefined = { type: 'undefined' }
  export type Null = { type: 'null' }
  export type Bool = { type: 'bool' }
  export type String = { type: 'string' }
  export type Literal<T extends _LiteralType> = {
    type: 'literal'
    literal: T
  }
  export type Int = { type: 'int' }
  export type Float = { type: 'float' }
  export type Timestamp = { type: 'timestamp' }
  export type Array<T extends Value> = { type: 'array'; valueType: T }
  export type ArrayJson<T extends JsonValue> = Array<T>
  export type Map = { [key: string]: Value }
  export type MapJson = { [key: string]: JsonValue }

  export type JsonValue =
    | UnionJson<any[]>
    | IntersectionJson<any[]>
    | Unknown
    | Undefined
    | Null
    | Bool
    // eslint-disable-next-line @typescript-eslint/ban-types
    | String
    | Literal<any>
    | Int
    | Float
    | ArrayJson<any>
    | MapJson

  export type Value =
    | JsonValue
    | Union<any[]>
    | Intersection<any[]>
    | Timestamp
    | Array<any>
    | Map

  export type _DocData = Map | Union<any[]> | Intersection<any[]>
  export type _JsonData = MapJson | UnionJson<any[]> | IntersectionJson<any[]>
}

export type InferSchemaType<
  T extends SchemaType.Value,
  Depth extends number = 7,
> = [Depth] extends [never]
  ? never
  : T extends SchemaType.Union<infer U>
  ? InferSchemaType<U[number], Subtract[Depth]>
  : T extends SchemaType.Intersection<infer U>
  ? UnionToIntersection<InferSchemaType<U[number], Subtract[Depth]>>
  : T extends SchemaType.Unknown
  ? unknown
  : T extends SchemaType.Undefined
  ? undefined
  : T extends SchemaType.Null
  ? null
  : T extends SchemaType.Bool
  ? boolean
  : T extends SchemaType.String
  ? string
  : T extends SchemaType.Literal<infer U>
  ? U
  : T extends SchemaType.Int
  ? number
  : T extends SchemaType.Float
  ? number
  : T extends SchemaType.Timestamp
  ? FTypes.Timestamp
  : T extends SchemaType.Array<infer U>
  ? InferSchemaType<U, Subtract[Depth]>[]
  : T extends SchemaType.Map
  ? {
      [K in keyof T]: InferSchemaType<T[K], Subtract[Depth]>
    }
  : never

export class SchemaTypeProvider {
  union<T extends SchemaType.Value[]>(...valueTypes: T): SchemaType.Union<T> {
    return { type: 'union', valueTypes }
  }
  intersection<T extends SchemaType.Value[]>(
    ...valueTypes: T
  ): SchemaType.Intersection<T> {
    return { type: 'intersection', valueTypes }
  }

  unknown: SchemaType.Unknown = { type: 'unknown' }
  undefined: SchemaType.Undefined = { type: 'undefined' }
  null: SchemaType.Null = { type: 'null' }
  bool: SchemaType.Bool = { type: 'bool' }

  string: SchemaType.String = { type: 'string' }
  literal<T extends SchemaType._LiteralType>(
    literal: T,
  ): SchemaType.Literal<T> {
    return {
      type: 'literal',
      literal,
    }
  }

  int: SchemaType.Int = { type: 'int' }
  float: SchemaType.Float = { type: 'float' }
  timestamp: SchemaType.Timestamp = { type: 'timestamp' }

  array<T extends SchemaType.Value>(valueType: T): SchemaType.Array<T> {
    return {
      type: 'array',
      valueType,
    }
  }

  optional<T extends SchemaType.Value>(valueType: T) {
    return this.union(valueType, this.undefined)
  }
}

export const $ = new SchemaTypeProvider()
