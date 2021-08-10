import * as firestore from 'firebase-admin/firestore'
import { Firestore } from 'firebase-admin/firestore'
import { STypes } from '../../types'
import { FirestoreModel, InferFirestoreModelS } from '../model'
import { TypedFirestoreUniv } from './TypedFirestore'
import { createFirestoreStaticAdmin } from './_static'

export class TypedFirestoreAdmin<
  M extends FirestoreModel<STypes.RootOptions.All>,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> extends TypedFirestoreUniv<M, Firestore, S> {
  constructor(readonly model: M, readonly raw: Firestore) {
    super(model, createFirestoreStaticAdmin(firestore), raw)
  }
}
