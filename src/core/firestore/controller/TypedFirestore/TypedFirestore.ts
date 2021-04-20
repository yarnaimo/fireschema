import { $collectionGroups } from '../../../constants'
import { FTypes, STypes } from '../../../types'
import { Loc } from '../../../types/_object'
import { firestorePathToLoc } from '../../../utils/_firestore'
import { TypedQueryRef } from './TypedCollectionRef'
import { TypedDocumentRef } from './TypedDocumentRef'
import { TypedFDBase } from './TypedFDBase'
import { TypedTransaction } from './TypedTransaction'
import { TypedWriteBatch } from './TypedWriteBatch'

export class TypedFirestore<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp
> extends TypedFDBase<S, F, '', true> {
  constructor(
    schemaOptions: S,
    firestoreStatic: FTypes.FirestoreStatic<F>,
    raw: F,
  ) {
    super(schemaOptions, firestoreStatic, '', raw)
  }

  private origGroup(collectionName: string) {
    return this.raw.collectionGroup(collectionName) as FTypes.Query<any, F>
  }

  collectionGroup<L extends Loc<S>>(
    collectionName: Extract<keyof S[typeof $collectionGroups], string>,
    loc: L,
  ) {
    return new TypedQueryRef<S, F, L>(
      this.schemaOptions,
      this.firestoreStatic,
      loc,
      this.origGroup(collectionName),
    )
  }

  collectionGroupQuery<L extends Loc<S>>(
    collectionName: Extract<keyof S[typeof $collectionGroups], string>,
    loc: L,
    selector: STypes.Selector<S, F, L>,
  ) {
    return new TypedQueryRef<S, F, L>(
      this.schemaOptions,
      this.firestoreStatic,
      loc,
      this.origGroup(collectionName),
      selector,
    )
  }

  // docref に L がある場合
  wrapDocument<
    D extends FTypes.DocumentRef<any, F>,
    L extends string = STypes.InferDocT<D>['__loc__']
  >(raw: D): TypedDocumentRef<S, F, L>

  // TODO: docref に L がない場合
  // wrapDocument<L extends string[]>(
  //   raw: FTypes.DocumentRef<any, F>,
  // ): TypedDocumentRef<S, F, L>

  wrapDocument<L extends string>(
    raw: FTypes.DocumentRef<any, F>,
  ): TypedDocumentRef<S, F, L> {
    const loc = firestorePathToLoc(raw.path) as L
    return new TypedDocumentRef<S, F, L>(
      this.schemaOptions,
      this.firestoreStatic,
      loc,
      raw,
    )
  }

  async runTransaction<T>(
    fn: (tt: TypedTransaction<S, F>) => Promise<T>,
  ): Promise<T> {
    return this.raw.runTransaction(async (_t: any) => {
      const tt = new TypedTransaction<S, F>(
        this.firestoreStatic,
        _t as FTypes.Transaction<F>,
      )
      return fn(tt)
    })
  }

  batch() {
    return new TypedWriteBatch<S, F>(
      this.firestoreStatic,
      this.raw.batch() as FTypes.WriteBatch<F>,
    )
  }
}
