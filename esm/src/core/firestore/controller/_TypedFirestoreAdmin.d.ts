import { Firestore } from 'firebase-admin/firestore';
import { STypes } from '../../types/index.js';
import { FirestoreModel, InferFirestoreModelS } from '../model.js';
import { TypedFirestoreUniv } from './TypedFirestore.js';
export declare class TypedFirestoreAdmin<M extends FirestoreModel<STypes.RootOptions.All>, S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>> extends TypedFirestoreUniv<M, Firestore, S> {
    readonly model: M;
    readonly raw: Firestore;
    constructor(model: M, raw: Firestore);
}
