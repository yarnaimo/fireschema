import { Type } from '../lib/type'
import { FTypes } from '../types/FTypes'
import {
  $adapter,
  $allow,
  $array,
  $collectionGroups,
  $docLabel,
  $functions,
  $schema,
} from './constants/symbols'

export const allowOptions = {
  read: {
    read: null,
    get: null,
    list: null,
  },
  write: {
    write: null,
    create: null,
    update: null,
    delete: null,
  },
}

export declare namespace STypes {
  export type ConditionExp = string | true
  // type DataTypes =
  //   | 'string'
  //   | 'int'
  //   | 'float'
  //   | 'bool'
  //   | 'null'
  //   | 'timestamp'
  //   | 'list'
  //   | 'map';

  type Is<T, U, Nullable extends 1 | 0 = 0> = Nullable extends 0
    ? T extends null
      ? 0
      : T extends U
      ? 1
      : 0
    : T extends U | null
    ? 1
    : 0

  type EnsureArray<T> = T extends unknown[] ? T : never

  type ValueType<T, U> = T extends U | null
    ? [T, 'null']
    : T extends U
    ? T
    : never

  type N<T> = readonly [T, 'null']

  export type DataSchemaValueType<T> = Is<T, null> extends 1
    ? 'null'
    : Is<T, string> extends 1
    ? 'string'
    : Is<T, string, 1> extends 1
    ? N<'string'>
    : Is<T, number> extends 1
    ? 'int' | 'float'
    : Is<T, number, 1> extends 1
    ? N<'int' | 'float'>
    : Is<T, boolean> extends 1
    ? 'bool'
    : Is<T, boolean, 1> extends 1
    ? N<'bool'>
    : Is<T, FTypes.Timestamp> extends 1
    ? 'timestamp'
    : Is<T, FTypes.Timestamp, 1> extends 1
    ? N<'timestamp'>
    : Is<T, unknown[]> extends 1
    ? { [$array]: DataSchemaValueType<EnsureArray<T>[number]> } | 'list'
    : Is<T, unknown[], 1> extends 1
    ? N<{ [$array]: DataSchemaValueType<EnsureArray<T>[number]> }> | N<'list'>
    : Is<T, object> extends 1
    ? DataSchemaObject<T> | 'map'
    : Is<T, object, 1> extends 1
    ? N<DataSchemaObject<T>> | N<'map'>
    : never

  export type DataSchemaObject<T> = {
    [K in keyof T]: DataSchemaValueType<T[K]>
  }

  export type DataSchemaOptions<T> =
    | Extract<DataSchemaValueType<T>, object>
    | Extract<DataSchemaValueType<T>, object>[]

  export type DataSchemaOptionsWithType<T> = { __T__: T } & Extract<
    DataSchemaValueType<T>,
    object
  >

  export type FunctionsOptions = {
    [key: string]: string
  }

  export namespace RootOptions {
    export type Meta = {
      [$functions]: FunctionsOptions
      [$collectionGroups]: CollectionOptions.Children
    }
    export type Children = {
      [K in string]: CollectionOptions.All
    }

    export type All = Meta & Children
  }

  export namespace CollectionOptions {
    export type Meta = {
      [$schema]:
        | DataSchemaOptionsWithType<object>
        | DataSchemaOptionsWithType<object>[]
      [$adapter]: Adapter<any, any, any, any> | null
      [$docLabel]: string
      // [$collectionGroup]?: boolean
      [$allow]: AllowOptions
    }
    export type Children = {
      [K in string]: Meta & Children
    }

    export type All = Meta & Children
  }

  export type AllowOptions = {
    [K in keyof (typeof allowOptions.read & typeof allowOptions.write)]+?:
      | string
      | true
  }

  // export type CollectionInterface<T> = null

  export type Selectors<
    L extends string[] | null,
    SL,
    F extends FTypes.FirestoreApp
  > = {
    [K in keyof SL]: SL[K] extends (...args: infer A) => FTypes.Query<infer U>
      ? (
          ...args: A
        ) => FTypes.Query<
          U & STypes.DocumentMeta<F> & HasLoc<NonNullable<L>>,
          F
        >
      : SL[K]
  }

  export type Adapter<
    T,
    L extends string[] | null,
    SL,
    F extends FTypes.FirestoreApp
  > = ((q: FTypes.Query<T>) => Adapted<L, SL, F>) & {
    __SL__: SL
  }

  export type Adapted<
    L extends string[] | null,
    SL,
    F extends FTypes.FirestoreApp
  > = {
    select: Selectors<L, SL, F>
  }

  export type HasLoc<L extends string[]> = {
    __loc__: L
  }

  type DocFieldToWrite<
    T,
    F extends FTypes.FirestoreApp = FTypes.FirestoreApp
  > = T extends FTypes.Timestamp ? FTypes.Timestamp<F> : T

  export type DocumentMeta<
    F extends FTypes.FirestoreApp = FTypes.FirestoreApp
  > = {
    _createdAt: FTypes.Timestamp<F>
    _updatedAt: FTypes.Timestamp<F>
  }

  type WithoutLoc<T> = T extends HasLoc<any> ? Type.Except<T, '__loc__'> : T
  type WithoutMeta<T> = T extends DocumentMeta
    ? Type.Except<T, keyof DocumentMeta>
    : T

  export type DocDataToWrite<
    T,
    F extends FTypes.FirestoreApp = FTypes.FirestoreApp,
    _T = WithoutMeta<WithoutLoc<T>>
  > = {
    [K in keyof _T]: DocFieldToWrite<_T[K], F> | FTypes.FieldValue<F>
  }
}
