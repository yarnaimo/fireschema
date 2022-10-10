import {
  GetSchemaOptionsByLoc,
  JoinLoc,
  KeysWithoutDocLabel,
} from '../../types/_object.js'
import { FTypes, STypes } from '../../types/index.js'
import { TypedConstructorOptions } from './ConstructorOptions.js'
import { TypedCollectionRef } from './TypedCollectionRef.js'
export declare class TypedFDBase<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  IsRoot extends boolean,
  U = STypes.DocDataAt<S, F, L>,
  _C = GetSchemaOptionsByLoc<S, L>,
> {
  readonly options: TypedConstructorOptions<S, F, L>
  readonly raw: IsRoot extends true ? F : FTypes.DocumentRef<U, F>
  protected constructor(
    options: TypedConstructorOptions<S, F, L>,
    raw: IsRoot extends true ? F : FTypes.DocumentRef<U, F>,
  )
  private origCollection
  collection<N extends KeysWithoutDocLabel<_C>>(
    collectionName: N,
  ): TypedCollectionRef<
    S,
    F,
    JoinLoc<L, N>,
    STypes.DocDataAt<S, F, JoinLoc<L, N>>
  >
}
