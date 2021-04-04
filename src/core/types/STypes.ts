import { _admin, _web } from '../../lib/firestore-types'
import { Type } from '../../lib/type'
import {
  $allow,
  $collectionGroups,
  $docLabel,
  $functions,
  $schema,
} from '../constants'
import { FTypes } from './FTypes'
import { ParseCollectionPath } from './_firestore'
import { GetDeep } from './_object'

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
  export type GetDocT<
    D extends FTypes.FirestoreApp | FTypes.DocumentRef<unknown>
  > = D extends FTypes.DocumentRef<infer T> ? T : never

  export type GetCollectionT<
    C extends FTypes.CollectionRef<unknown>
  > = C extends FTypes.CollectionRef<infer T> ? T : never

  export type GetSchemaU<_C> = EnsureOptions<_C>[typeof $schema]['__U__']

  export type GetSchemaT<_C> = EnsureOptions<_C>[typeof $schema]['__T__']

  export type OmitLast<T extends any[]> = T extends [
    ...(infer U extends any[] ? infer U : never),
    unknown,
  ]
    ? U
    : T extends any[]
    ? T
    : never

  export type Parent<F extends FTypes.FirestoreApp = FTypes.FirestoreApp> =
    | F
    | FTypes.DocumentRef<STypes.HasLoc<string[]>, F>

  export type GetFFromParent<
    P extends Parent<any>
  > = P extends FTypes.FirestoreApp
    ? P
    : P extends _web.DocumentReference<any>
    ? _web.Firestore
    : _admin.Firestore

  export type GetFFromDocumentRef<
    D extends FTypes.DocumentRef<any>
  > = D extends _web.DocumentReference ? _web.Firestore : _admin.Firestore

  export type GetFFromCollectionRef<
    D extends FTypes.CollectionRef<any>
  > = D extends _web.CollectionReference ? _web.Firestore : _admin.Firestore

  export type EnsureOptions<_C> = _C extends STypes.CollectionOptions.Meta
    ? _C
    : never

  export type GetL<P extends Parent, N> = [...GetPL<P>, N]
  export type GetPL<P extends Parent> = P extends FTypes.FirestoreApp
    ? []
    : GetDocT<P>['__loc__']

  export type GetSL<
    _C
  > = EnsureOptions<_C>[typeof $schema] extends STypes.CollectionSchema<
    any,
    any,
    any
  >
    ? EnsureOptions<_C>[typeof $schema]['__SL__']
    : {}

  export type DocDataFromOptions<
    F extends FTypes.FirestoreApp,
    _C,
    L extends string[]
  > = STypes.DocData<F, GetSchemaU<_C>, L, GetSchemaT<_C>>

  export type FTDocDataFromOptions<
    F extends FTypes.FirestoreApp,
    _C,
    L extends string[]
  > = STypes.DocData<F, GetSchemaT<_C>, L, GetSchemaT<_C>>
}

export declare namespace STypes {
  export type DocData<
    F extends FTypes.FirestoreApp,
    U,
    L extends string[],
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
    snapshot: FTypes.QueryDocumentSnap<T>,
    options: FTypes.SnapshotOptions,
  ) => U

  export type CollectionSchema<T, U = T, SL = {}> = {
    __T__: T
    __U__: U
    __SL__: SL
    schema: string
    decoder: Decoder<T, U> | undefined
    selectors: (q: FTypes.Query<U>) => SL
  }

  export namespace CollectionOptions {
    export type Meta = {
      [$docLabel]: string
      [$schema]: CollectionSchema<any>
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
    F extends FTypes.FirestoreApp,
    L extends string[],
    // P extends Utils.Parent,
    // N extends Extract<keyof PC, string>,
    // PC,
    _C
  > = (
    q: Selectors<STypeUtils.GetSchemaT<_C>, L, STypeUtils.GetSL<_C>, F>,
  ) => FTypes.Query<STypeUtils.DocDataFromOptions<F, _C, L>, F>

  export type Selectors<
    T,
    L extends string[] | null,
    SL,
    F extends FTypes.FirestoreApp
  > = {
    [K in keyof SL]: SL[K] extends (...args: infer A) => FTypes.Query<infer U>
      ? (...args: A) => FTypes.Query<DocData<F, U, NonNullable<L>, T>, F>
      : SL[K]
  }

  export type HasLoc<L extends string[]> = {
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
    CP extends string,
    L extends string[] = ParseCollectionPath<CP>,
    _C = GetDeep<S, L>
  > = DocData<F, STypeUtils.GetSchemaU<_C>, L, STypeUtils.GetSchemaT<_C>>

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
