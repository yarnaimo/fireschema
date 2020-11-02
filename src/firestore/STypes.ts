import { Type } from '../lib/type'
import { FTypes } from '../types/FTypes'
import { GetDeep, Loc } from '../types/_object'
import {
  $adapter,
  $allow,
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
  export type ConditionExp = string | boolean

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

  export type Decoder<T, U> = (
    snapshot: FTypes.QueryDocumentSnap<T>,
    options: FTypes.SnapshotOptions,
  ) => U

  export type DocumentSchema<T, U = T> = {
    __T__: T
    __U__: U
    schema: string
    decoder: Decoder<T, U> | undefined
  }

  export namespace CollectionOptions {
    export type Meta = {
      [$schema]: DocumentSchema<any>
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
    [K in keyof (typeof allowOptions.read &
      typeof allowOptions.write)]+?: ConditionExp
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

  export type EnsureOptions<_C> = _C extends CollectionOptions.Meta ? _C : never

  export type HasLoc<L extends string[]> = {
    __loc__: L
  }
  export type HasT<T> = {
    __T__: T
  }

  export type UAt<
    F extends FTypes.FirestoreApp,
    S extends STypes.RootOptions.All,
    L extends Loc<S>,
    _C = GetDeep<S, L>
  > = EnsureOptions<_C>[typeof $schema]['__U__'] &
    DocumentMeta<F> &
    HasLoc<L> &
    HasT<EnsureOptions<_C>[typeof $schema]['__T__']>

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
