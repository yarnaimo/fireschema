import {
  GetSchemaOptionsByLoc,
  JoinLoc,
  KeysWithoutDocLabel,
} from '../../types/_object.js'
import { FTypes, STypes } from '../../types/index.js'
import { joinLoc } from '../../utils/_object.js'
import { TypedConstructorOptions } from './ConstructorOptions.js'
import { TypedCollectionRef } from './TypedCollectionRef.js'
import { collectionUniv } from './_universal.js'

export class TypedFDBase<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  IsRoot extends boolean,
  U = STypes.DocDataAt<S, F, L>,
  _C = GetSchemaOptionsByLoc<S, L>,
> {
  protected constructor(
    readonly options: TypedConstructorOptions<S, F, L>,
    readonly raw: IsRoot extends true ? F : FTypes.DocumentRef<U, F>,
  ) {}

  private origCollection(name: string) {
    return collectionUniv(this.raw, name) as FTypes.CollectionRef<any, F>
  }

  collection<N extends KeysWithoutDocLabel<_C>>(collectionName: N) {
    const loc = joinLoc(this.options.loc, collectionName)

    return new TypedCollectionRef<S, F, JoinLoc<L, N>>(
      { ...this.options, loc },
      this.origCollection(collectionName),
    )
  }
}
