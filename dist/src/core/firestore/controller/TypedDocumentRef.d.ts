import { FTypes, STypes } from '../../types/index.js'
import { TypedConstructorOptions } from './ConstructorOptions.js'
import { TypedCollectionRef } from './TypedCollectionRef.js'
import { TypedFDBase } from './TypedFDBase.js'
import { GetSource } from './_universal.js'
import { DataOrFn } from './_utils.js'
export declare class DocumentNotExistsError extends Error {}
export declare type DocumentSnapTransformer<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = (data: U, snap: TypedDocumentSnap<S, F, L, U>) => V
export declare type QueryDocumentSnapTransformer<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = (data: U, snap: TypedQueryDocumentSnap<S, F, L, U>) => V
export declare const withRefTransformer: <
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
>(
  data: U,
  snap: TypedDocumentSnap<S, F, L, U>,
) => U & {
  ref: TypedDocumentRef<S, F, L, U>
}
export declare type DocumentSnapDataOptions<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = {
  snapshotOptions?: FTypes.SnapshotOptions<F>
  transformer?: DocumentSnapTransformer<S, F, L, U, V>
}
export declare type QueryDocumentSnapDataOptions<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = {
  snapshotOptions?: FTypes.SnapshotOptions<F>
  transformer?: QueryDocumentSnapTransformer<S, F, L, U, V>
}
export declare class TypedDocumentSnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly raw: FTypes.DocumentSnap<U, F>
  readonly ref: TypedDocumentRef<S, F, L, U>
  readonly id: string
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    raw: FTypes.DocumentSnap<U, F>,
  )
  exists(): this is TypedQueryDocumentSnap<S, F, L, U>
  data<V = U>({
    snapshotOptions,
    transformer,
  }?: DocumentSnapDataOptions<S, F, L, U, V>): V | undefined
}
export declare class TypedQueryDocumentSnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedDocumentSnap<S, F, L, U> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly raw: FTypes.QueryDocumentSnap<U, F>
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    raw: FTypes.QueryDocumentSnap<U, F>,
  )
  data<V = U>({
    snapshotOptions,
    transformer,
  }?: QueryDocumentSnapDataOptions<S, F, L, U, V>): V
}
export declare class TypedDocumentRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedFDBase<S, F, L, false, U> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly raw: FTypes.DocumentRef<U, F>
  readonly id: string
  readonly path: string
  private readonly dataHelper
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    raw: FTypes.DocumentRef<U, F>,
  )
  private wrapWriteResult
  parentCollection(): TypedCollectionRef<S, F, L, STypes.DocDataAt<S, F, L>>
  get({ from }?: { from?: GetSource }): Promise<TypedDocumentSnap<S, F, L, U>>
  getData<V = U>({
    from,
    ...dataOptions
  }?: {
    from?: GetSource
  } & DocumentSnapDataOptions<S, F, L, U, V>): Promise<V | undefined>
  getDataOrThrow<V = U>(
    options?: {
      from?: GetSource
    } & DocumentSnapDataOptions<S, F, L, U, V>,
  ): Promise<V>
  create(
    dataOrFn: DataOrFn<STypes.WriteData<S, F, L>>,
  ): Promise<FTypes.Env<F, void, FirebaseFirestore.WriteResult>>
  setMerge(
    dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>,
  ): Promise<FTypes.Env<F, void, FirebaseFirestore.WriteResult>>
  update(
    dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>,
  ): Promise<FTypes.Env<F, void, FirebaseFirestore.WriteResult>>
  delete(): Promise<FTypes.Env<F, void, FirebaseFirestore.WriteResult>>
}
