import { KeysWithoutDocLabel, SchemaLoc } from '../../types/_object.js'
import { FTypes, STypes } from '../../types/index.js'
import { firestorePathToLoc } from '../../utils/_firestore.js'
import { FirestoreModel, InferFirestoreModelS } from '../model.js'
import { TypedSelectable } from './TypedCollectionRef.js'
import { TypedDocumentRef } from './TypedDocumentRef.js'
import { TypedFDBase } from './TypedFDBase.js'
import { TypedTransaction } from './TypedTransaction.js'
import { TypedWriteBatch } from './TypedWriteBatch.js'
import { FirestoreStatic, firestoreStaticWeb } from './_static.js'
import {
  collectionGroupUniv,
  runTransactionUniv,
  writeBatchUniv,
} from './_universal.js'

import type { Firestore } from 'firebase/firestore'

export class TypedFirestoreUniv<
  M extends FirestoreModel<STypes.RootOptions.All>,
  F extends FTypes.FirestoreApp,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> extends TypedFDBase<S, F, '', true> {
  constructor(
    readonly model: M,
    readonly firestoreStatic: FirestoreStatic<F>,
    readonly raw: F,
  ) {
    super(
      {
        schemaOptions: model.schemaOptions as S,
        firestoreStatic,
        loc: '',
      },
      raw,
    )
  }

  private origGroup(collectionName: string) {
    return collectionGroupUniv(this.raw, collectionName) as FTypes.Query<any, F>
  }

  collectionGroup<L extends SchemaLoc<S>>(
    collectionName: KeysWithoutDocLabel<S['collectionGroups']>,
    loc: L,
  ) {
    return new TypedSelectable<S, F, L>(
      { ...this.options, loc },
      this.origGroup(collectionName),
    )
  }

  // docref に L がある場合
  wrapDocument<
    D extends FTypes.DocumentRef<any, F>,
    L extends string = STypes.InferDocT<D>['__loc__'],
  >(raw: D): TypedDocumentRef<S, F, L>

  // TODO: docref に L がない場合
  // wrapDocument<L extends string[]>(
  //   raw: FTypes.DocumentRef<any, F>,
  // ): TypedDocumentRef<S, F, L>

  wrapDocument<L extends string>(
    rawDocRef: FTypes.DocumentRef<any, F>,
  ): TypedDocumentRef<S, F, L> {
    const loc = firestorePathToLoc(rawDocRef.path) as L
    return new TypedDocumentRef<S, F, L>({ ...this.options, loc }, rawDocRef)
  }

  async runTransaction<T>(
    fn: (tt: TypedTransaction<S, F>) => Promise<T>,
  ): Promise<T> {
    return runTransactionUniv(this.raw, async (_t) => {
      const tt = new TypedTransaction<S, F>(
        this.options,
        _t as FTypes.Transaction<F>,
      )
      return fn(tt)
    })
  }

  batch() {
    return new TypedWriteBatch<S, F>(
      this.options.firestoreStatic,
      writeBatchUniv(this.raw) as FTypes.WriteBatch<F>,
    )
  }
}

export class TypedFirestoreWeb<
  M extends FirestoreModel<STypes.RootOptions.All>,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> extends TypedFirestoreUniv<M, Firestore, S> {
  constructor(readonly model: M, readonly raw: Firestore) {
    super(model, firestoreStaticWeb, raw)
  }
}
