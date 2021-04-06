import { Type } from '../../lib/type'
import {
  $allow,
  $collectionGroups,
  $docLabel,
  $functions,
  $schema,
} from '../constants'
import { FTypes } from './FTypes'
import { GetByLoc, Loc } from './_object'

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

export declare namespace STypeUtils {
  export type InferDocT<
    D extends FTypes.FirestoreApp | FTypes.DocumentRef<unknown>
  > = D extends FTypes.DocumentRef<infer T> ? T : never

  export type InferCollectionT<
    C extends FTypes.CollectionRef<unknown>
  > = C extends FTypes.CollectionRef<infer T> ? T : never

  export type GetSchemaU<_C> = EnsureOptions<_C>[typeof $schema]['__U__']

  export type GetSchemaT<_C> = EnsureOptions<_C>[typeof $schema]['__T__']

  export type EnsureOptions<_C> = _C extends STypes.CollectionOptions.Meta
    ? _C
    : never

  export type GetSL<
    _C
  > = EnsureOptions<_C>[typeof $schema] extends STypes.CollectionSchema<
    any,
    any,
    any
  >
    ? EnsureOptions<_C>[typeof $schema]['__SL__']
    : {}

  export type DocDataAt<
    S extends STypes.RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string
  > = STypes.DocData<
    F,
    GetSchemaU<GetByLoc<S, L>>,
    L,
    GetSchemaT<GetByLoc<S, L>>
  >

  export type FTDocDataAt<
    S extends STypes.RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string
  > = STypes.DocData<
    F,
    GetSchemaT<GetByLoc<S, L>>,
    L,
    GetSchemaT<GetByLoc<S, L>>
  >
}

export declare namespace STypes {
  export type DocData<
    F extends FTypes.FirestoreApp,
    U,
    L extends string,
    T
  > = STypes.DocumentMeta<F> &
    U &
    STypes.HasLoc<L> &
    STypes.HasT<T> &
    STypes.HasId

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
    data: T,
    snapshot: FTypes.QueryDocumentSnap<T>,
  ) => U

  export type CollectionSchema<T, U, HasDecoder extends boolean, SL = {}> = {
    __T__: T
    __U__: U
    __SL__: SL
    schema: string
    decoder: HasDecoder extends true ? Decoder<T, U> : undefined
    selectors: (q: FTypes.Query<U>) => SL
  }

  export namespace CollectionOptions {
    export type Meta = {
      [$docLabel]: string
      [$schema]: CollectionSchema<any, any, any>
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

  export type Select<
    S extends STypes.RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string,
    // P extends Utils.Parent,
    // N extends Extract<keyof PC, string>,
    // PC,
    _C = GetByLoc<S, L>
  > = (
    q: Selectors<STypeUtils.GetSchemaT<_C>, L, STypeUtils.GetSL<_C>, F>,
  ) => FTypes.Query<STypeUtils.DocDataAt<S, F, L>, F>

  export type Selectors<
    T,
    L extends string | null,
    SL,
    F extends FTypes.FirestoreApp
  > = {
    [K in keyof SL]: SL[K] extends (...args: infer A) => FTypes.Query<infer U>
      ? (...args: A) => FTypes.Query<DocData<F, U, NonNullable<L>, T>, F>
      : SL[K]
  }

  export type HasLoc<L extends string> = {
    __loc__: L
  }
  export type HasT<T> = {
    __T__: T
  }
  export type HasId = {
    id: string
  }

  export type UAt<
    S extends STypes.RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string = Loc<S>,
    _C = GetByLoc<S, L>
  > = DocData<F, STypeUtils.GetSchemaU<_C>, L, STypeUtils.GetSchemaT<_C>>

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

  type WriteDataField<
    T,
    F extends FTypes.FirestoreApp = FTypes.FirestoreApp
  > = T extends FTypes.Timestamp ? FTypes.Timestamp<F> : T

  export type WriteData<
    S extends STypes.RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string,
    T = STypeUtils.DocDataAt<S, F, L>['__T__'],
    _T = WithoutMeta<WithoutLoc<T>>
  > = {
    [K in keyof _T]: WriteDataField<_T[K], F> | FTypes.FieldValue<F>
  }
}
