import { FTypes, STypes } from '../../types'
import { GetByLoc, JoinLoc } from '../../types/_object'
import { joinLoc } from '../../utils/_object'
import { TypedCollectionRef, TypedQueryRef } from './TypedCollectionRef'

export class TypedFDBase<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  IsRoot extends boolean,
  U = STypes.DocDataAt<S, F, L>,
  _C = GetByLoc<S, L>,
> {
  protected constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FTypes.FirestoreStatic<F>
      loc: L
    },
    readonly raw: IsRoot extends true ? F : FTypes.DocumentRef<U, F>,
  ) {}

  private origCollection(name: string) {
    return this.raw.collection(name) as FTypes.CollectionRef<any, F>
  }

  collection<N extends Extract<keyof _C, string>>(collectionName: N) {
    const loc = joinLoc(this.options.loc, collectionName)

    return new TypedCollectionRef<S, F, JoinLoc<L, N>>(
      { ...this.options, loc },
      this.origCollection(collectionName),
    )
  }

  collectionQuery<N extends Extract<keyof _C, string>>(
    collectionName: N,
    selector: STypes.Selector<S, F, JoinLoc<L, N>>,
  ) {
    const loc = joinLoc(this.options.loc, collectionName)

    return new TypedQueryRef<S, F, JoinLoc<L, N>>(
      { ...this.options, loc },
      this.origCollection(collectionName),
      selector,
    )
  }
}
