import { QueryConstraint } from 'firebase/firestore'

import { Type } from '../../lib/type.js'
import { QueryBuilder } from '../firestore/controller/_query.js'
import { FirestoreStatic } from '../firestore/controller/_static.js'
import {
  DataModel,
  InferDataModelSL,
  InferDataModelT,
  InferDataModelU,
} from '../firestore/index.js'
import { FTypes } from './FTypes.js'
import { GetSchemaOptionsByLoc, PlainLoc } from './_object.js'

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
  export type InferDocT<
    D extends FTypes.FirestoreApp | FTypes.DocumentRef<unknown>,
  > = D extends FTypes.DocumentRef<infer T> ? T : never

  export type InferCollectionT<C extends FTypes.CollectionRef<unknown>> =
    C extends FTypes.CollectionRef<infer T> ? T : never

  export type GetModelU<_C> = InferDataModelU<EnsureOptions<_C>['model']>

  export type GetModelT<_C> = InferDataModelT<EnsureOptions<_C>['model']>

  export type EnsureOptions<_C> = _C extends CollectionOptions.Meta ? _C : never

  export type GetSL<_C> = InferDataModelSL<EnsureOptions<_C>['model']>

  export type DocDataAt<
    S extends RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string,
  > = DocData<
    F,
    GetModelU<GetSchemaOptionsByLoc<S, L>>,
    L,
    GetModelT<GetSchemaOptionsByLoc<S, L>>
  >

  export type FTDocDataAt<
    S extends RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string,
  > = DocData<
    F,
    GetModelT<GetSchemaOptionsByLoc<S, L>>,
    L,
    GetModelT<GetSchemaOptionsByLoc<S, L>>
  >

  export type DocData<
    F extends FTypes.FirestoreApp,
    U,
    L extends string,
    T,
  > = DocumentMeta<F> & U & HasLoc<L> & HasT<T> & HasId

  export type ConditionExp = string | boolean

  export type FunctionsOptions = {
    [key: string]: string
  }

  export namespace RootOptions {
    export type Meta = {
      functions: FunctionsOptions
      collectionGroups: CollectionOptions.Children
    }
    export type Children = {
      [K in `${string}/{${string}}`]: CollectionOptions.All
    }

    export type All = Meta & Children
  }

  export namespace CollectionOptions {
    export type Meta = {
      functions?: FunctionsOptions
      model: DataModel<any, any, STypes.Model.SelectorsConstraint>
      // [$collectionGroup]?: boolean
      allow: AllowOptions
    }
    export type Children = {
      [K in `${string}/{${string}}`]: Meta & Children
    }

    export type All = Meta & Children
  }

  export type AllowOptions = {
    [K in keyof (typeof allowOptions.read &
      typeof allowOptions.write)]+?: ConditionExp
  }

  export namespace Model {
    export type Decoder<T, U> = (
      data: T,
      snapshot: FTypes.QueryDocumentSnap<T>,
    ) => U

    export type Selectors<T, SL extends SelectorsConstraint> = (
      q: QueryBuilder<FieldPath<T>>,
      firestoreStatic: FirestoreStatic<FTypes.FirestoreApp>,
    ) => SL

    export type SelectorsConstraint = {
      [key: string]: (...args: any[]) => QueryConstraint[]
    }
  }

  export type FieldPath<T> = PlainLoc<T> | keyof DocumentMeta

  export type Selector<
    S extends RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string,
    // P extends Utils.Parent,
    // N extends Extract<keyof PC, string>,
    // PC,
    _C = GetSchemaOptionsByLoc<S, L>,
  > = (q: GetSL<_C>) => QueryConstraint[]

  export type SelectorOptions<
    T,
    L extends string | null,
    SL,
    F extends FTypes.FirestoreApp,
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

  export type DocumentMeta<
    F extends FTypes.FirestoreApp = FTypes.FirestoreApp,
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
    F extends FTypes.FirestoreApp = FTypes.FirestoreApp,
  > = T extends FTypes.Timestamp ? FTypes.Timestamp<F> : T

  export type WriteData<
    S extends RootOptions.All,
    F extends FTypes.FirestoreApp,
    L extends string,
    T = DocDataAt<S, F, L>['__T__'],
    _T = WithoutMeta<WithoutLoc<T>>,
  > = {
    [K in keyof _T]: WriteDataField<_T[K], F> | FTypes.FieldValue<F>
  }
}
