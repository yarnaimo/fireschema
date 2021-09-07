import { FTypes } from './index.js'

export const $type = Symbol('Fireschema - schema type')

export type InferSchemaType<T, Depth extends number = 7> = [Depth] extends [
  never,
]
  ? never
  : T extends { [$type]: infer U }
  ? U
  : { [K in keyof T]: InferSchemaType<T[K]> }

export type InferSchemaTypeToIntersect<T> = T extends undefined
  ? {}
  : T extends SchemaType.Value
  ? InferSchemaType<T>
  : {}

export namespace SchemaType {
  export type _LiteralType = string | number | boolean

  export type Union<T extends Value[]> = {
    type: 'union'
    valueTypes: T
    [$type]: InferSchemaType<T[number]>
  }
  export type UnionJson<T extends JsonValue[]> = Union<T>
  export type Intersection<T extends Value[]> = {
    type: 'intersection'
    valueTypes: T
    [$type]: InferSchemaTypeToIntersect<T[0]> &
      InferSchemaTypeToIntersect<T[1]> &
      InferSchemaTypeToIntersect<T[2]> &
      InferSchemaTypeToIntersect<T[3]> &
      InferSchemaTypeToIntersect<T[4]> &
      InferSchemaTypeToIntersect<T[5]> &
      InferSchemaTypeToIntersect<T[6]> &
      InferSchemaTypeToIntersect<T[7]> &
      InferSchemaTypeToIntersect<T[8]> &
      InferSchemaTypeToIntersect<T[9]>
  }
  export type IntersectionJson<T extends JsonValue[]> = Intersection<T>

  export type Unknown = { type: 'unknown'; [$type]: unknown }
  export type Undefined = { type: 'undefined'; [$type]: undefined }
  export type Null = { type: 'null'; [$type]: null }
  export type Bool = { type: 'bool'; [$type]: boolean }
  export type String = { type: 'string'; [$type]: string }
  export type Literal<L extends _LiteralType> = {
    type: 'literal'
    literal: L
    [$type]: L
  }
  export type Int = { type: 'int'; [$type]: number }
  export type Float = { type: 'float'; [$type]: number }
  export type Timestamp = { type: 'timestamp'; [$type]: FTypes.Timestamp }
  export type Array<T extends Value> = {
    type: 'array'
    valueType: T
    [$type]: InferSchemaType<T>[]
  }
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

const withT = <T>(value: Omit<T, typeof $type>) => value as T

export const $ = {
  union<T extends SchemaType.Value[]>(...valueTypes: T) {
    return withT<SchemaType.Union<T>>({
      type: 'union',
      valueTypes,
    })
  },
  intersection<T extends SchemaType.Value[]>(...valueTypes: T) {
    return withT<SchemaType.Intersection<T>>({
      type: 'intersection',
      valueTypes,
    })
  },

  unknown: withT<SchemaType.Unknown>({ type: 'unknown' }),
  undefined: withT<SchemaType.Undefined>({ type: 'undefined' }),
  null: withT<SchemaType.Null>({ type: 'null' }),
  bool: withT<SchemaType.Bool>({ type: 'bool' }),

  string: withT<SchemaType.String>({ type: 'string' }),
  literal<L extends SchemaType._LiteralType>(literal: L) {
    return withT<SchemaType.Literal<L>>({
      type: 'literal',
      literal,
    })
  },

  int: withT<SchemaType.Int>({ type: 'int' }),
  float: withT<SchemaType.Float>({ type: 'float' }),
  timestamp: withT<SchemaType.Timestamp>({ type: 'timestamp' }),

  array<T extends SchemaType.Value>(valueType: T) {
    return withT<SchemaType.Array<T>>({
      type: 'array',
      valueType,
    })
  },

  optional<T extends SchemaType.Value>(valueType: T) {
    return this.union(valueType, this.undefined)
  },
}
