import { JoinLoc, OmitLastSegment } from '../../types/_object.js'
import { FTypes, STypes } from '../../types/index.js'
import { TypedConstructorOptions } from './ConstructorOptions.js'
import {
  QueryDocumentSnapDataOptions,
  TypedDocumentRef,
  TypedQueryDocumentSnap,
} from './TypedDocumentRef.js'
import { GetSource } from './_universal.js'
export declare class TypedQuerySnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly raw: FTypes.QuerySnap<U, F>
  readonly docs: TypedQueryDocumentSnap<S, F, L, U>[]
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    raw: FTypes.QuerySnap<U, F>,
  )
}
export declare class TypedQueryRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly raw: FTypes.Query<U, F>
  readonly collectionOptions: STypes.CollectionOptions.Meta
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    origQuery: FTypes.Query<any, F>,
    skipDecoder?: boolean,
  )
  get({ from }?: { from?: GetSource }): Promise<TypedQuerySnap<S, F, L, U>>
  getData<V = U>({
    from,
    ...dataOptions
  }?: {
    from?: GetSource
  } & QueryDocumentSnapDataOptions<S, F, L, U, V>): Promise<V[]>
}
export declare class TypedSelectable<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedQueryRef<S, F, L, U> {
  readonly select: STypes.MappedSelectors<S, F, L>
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    origQuery: FTypes.Query<any, F>,
    skipDecoder?: boolean,
  )
}
export declare class TypedCollectionRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedSelectable<S, F, L, U> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly id: string
  readonly path: string
  readonly raw: FTypes.CollectionRef<U, F>
  constructor(
    options: TypedConstructorOptions<S, F, L>,
    origCollection: FTypes.CollectionRef<any, F>,
    skipDecoder?: boolean,
  )
  doc(id?: string): TypedDocumentRef<S, F, L, STypes.DocDataAt<S, F, L>>
  parentDocument<
    PL extends OmitLastSegment<L> = OmitLastSegment<L>,
  >(): L extends JoinLoc<string, string>
    ? TypedDocumentRef<S, F, PL>
    : undefined
}
