type Cons<H, T> = T extends readonly any[]
  ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
  : never

export type Subtract = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
]

export type IsPlainObject<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? false : true
}[keyof T]

export type PlainLoc<T, Depth extends number = 5> = [Depth] extends [never]
  ? never
  : T extends object
  ? IsPlainObject<T> extends true
    ? {
        [K in keyof T & string]-?:
          | K
          | (PlainLoc<T[K], Subtract[Depth]> extends infer P
              ? P extends string
                ? JoinLoc<K, P>
                : never
              : never)
      }[keyof T & string]
    : never
  : never

export type SchemaLoc<T, Depth extends number = 5> = [Depth] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]-?:
        | OmitDocLabel<K>
        | (SchemaLoc<T[K], Subtract[Depth]> extends infer P
            ? P extends string
              ? JoinLoc<OmitDocLabel<K>, P>
              : never
            : never)
    }[keyof T & string]
  : never

export type SchemaCollectionName<T, Depth extends number = 5> = [
  Depth,
] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]-?:
        | OmitDocLabel<K>
        | SchemaCollectionName<T[K], Subtract[Depth]>
    }[keyof T & string]
  : never

export type CollectionNameToLoc<
  T,
  N extends string,
  Depth extends number = 5,
> = [Depth] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]-?:
        | (OmitDocLabel<K> extends N ? OmitDocLabel<K> : never)
        | (CollectionNameToLoc<T[K], N, Subtract[Depth]> extends infer P
            ? P extends string
              ? JoinLoc<OmitDocLabel<K>, P>
              : never
            : never)
    }[keyof T & string]
  : never

export type JoinLoc<T extends string, U extends string> = T extends ''
  ? U
  : `${T}.${U}`

export type OmitLastSegment<L extends string> =
  L extends `${infer T}.${infer U}`
    ? U extends `${string}.${string}`
      ? `${T}.${OmitLastSegment<U>}`
      : T
    : L

export type ParseLocString<L extends string> = L extends ''
  ? []
  : L extends `${infer T}.${infer U}`
  ? [T, ...ParseLocString<U>]
  : [L]

export type OmitDocLabel<K> = K extends `/${infer N}/{${string}}` ? N : never

export type KeysWithoutDocLabel<_C> = {
  [K in keyof _C]: OmitDocLabel<K>
}[keyof _C]

// export type Leaves<T, Depth extends number = 5> = [Depth] extends [never]
//   ? never
//   : T extends object
//   ? {
//       [K in keyof T & string]-?: Cons<K, Leaves<T[K], Subtract[Depth]>>
//     }[keyof T & string]
//   : []

type Shift<U> = U extends readonly [string, ...string[]]
  ? ((...args: U) => void) extends (top: any, ...args: infer T) => void
    ? T
    : never
  : never

type ChildOfSchemaOptions<T, LS extends string> = {
  [K in keyof T]: K extends `/${LS}/{${string}}` ? T[K] : never
}[keyof T]

export type GetDeep<T, LA extends readonly string[], D extends number = 5> = [
  D,
] extends [never]
  ? never
  : LA[0] extends keyof T
  ? {
      0: T[LA[0]]
      1: GetDeep<T[LA[0]], Shift<LA>, Subtract[D]>
    }[LA[1] extends undefined ? 0 : 1]
  : LA extends []
  ? T
  : never

type GetDeepOfSchemaOptions<
  T,
  LA extends readonly string[],
  D extends number = 5,
> = [D] extends [never]
  ? never
  : LA[0] extends string
  ? {
      0: ChildOfSchemaOptions<T, LA[0]>
      1: GetDeepOfSchemaOptions<
        ChildOfSchemaOptions<T, LA[0]>,
        Shift<LA>,
        Subtract[D]
      >
    }[LA[1] extends undefined ? 0 : 1]
  : LA extends []
  ? T
  : never

export type GetSchemaOptionsByLoc<
  T,
  L extends string,
  D extends number = 5,
> = GetDeepOfSchemaOptions<T, ParseLocString<L>, D>

export type GetDeepByKey<T, Key> = {
  [K in keyof T]: T[K] extends object
    ? GetDeepByKey<T[K], Key> | (K extends Key ? T[K] : never)
    : never
}[keyof T]
