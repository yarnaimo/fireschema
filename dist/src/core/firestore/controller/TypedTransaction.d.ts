import { FTypes, STypes } from '../../types/index.js'
import { TypedConstructorOptionsWithoutLoc } from './ConstructorOptions.js'
import {
  DocumentSnapDataOptions,
  TypedDocumentRef,
  TypedDocumentSnap,
} from './TypedDocumentRef.js'
import { DataOrFn } from './_utils.js'
export declare class TypedTransaction<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
> {
  readonly options: TypedConstructorOptionsWithoutLoc<S, F>
  readonly raw: FTypes.Transaction<F>
  private readonly dataHelper
  constructor(
    options: TypedConstructorOptionsWithoutLoc<S, F>,
    raw: FTypes.Transaction<F>,
  )
  get<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
  ): Promise<TypedDocumentSnap<S, F, L, STypes.DocDataAt<S, F, L>>>
  getData<
    L extends string,
    U extends STypes.DocDataAt<S, F, L> = STypes.DocDataAt<S, F, L>,
    V = U,
  >(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOptions?: DocumentSnapDataOptions<S, F, L, U, V>,
  ): Promise<V | undefined>
  create<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOrFn: DataOrFn<STypes.WriteData<S, F, L>>,
  ): this
  setMerge<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>,
  ): this
  update<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>,
  ): this
  delete<L extends string>(typedDoc: TypedDocumentRef<S, F, L>): this
}
