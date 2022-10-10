import { FTypes, STypes } from '../../types/index.js';
import { TypedDocumentRef } from './TypedDocumentRef.js';
import { FirestoreStatic } from './_static.js';
import { DataOrFn } from './_utils.js';
export declare class TypedWriteBatch<S extends STypes.RootOptions.All, F extends FTypes.FirestoreApp> {
    readonly firestoreStatic: FirestoreStatic<F>;
    readonly raw: FTypes.WriteBatch<F>;
    private readonly dataHelper;
    constructor(firestoreStatic: FirestoreStatic<F>, raw: FTypes.WriteBatch<F>);
    commit(): Promise<FTypes.Env<F, void, FirebaseFirestore.WriteResult[]>>;
    create<L extends string>(typedDoc: TypedDocumentRef<S, F, L>, dataOrFn: DataOrFn<STypes.WriteData<S, F, L>>): this;
    setMerge<L extends string>(typedDoc: TypedDocumentRef<S, F, L>, dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>): this;
    update<L extends string>(typedDoc: TypedDocumentRef<S, F, L>, dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>): this;
    delete<L extends string>(typedDoc: TypedDocumentRef<S, F, L>): this;
}
