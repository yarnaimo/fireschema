import { _admin } from '../../../lib/firestore-types.js';
import { _fadmin } from '../../../lib/functions-types.js';
import { ParseDocumentPath } from '../../types/_firestore.js';
import { FunTypes, STypes } from '../../types/index.js';
declare type F = _admin.Firestore;
export declare class TypedFirestoreTrigger<S extends STypes.RootOptions.All> {
    readonly firestoreSchema: S;
    readonly firestoreStatic: typeof _admin;
    readonly functions: typeof import('firebase-functions');
    constructor(firestoreSchema: S, firestoreStatic: typeof _admin, functions: typeof import('firebase-functions'));
    private buildDecoder;
    private buildSnapDecoder;
    onCreate<DP extends string, L extends string = ParseDocumentPath<DP>>({ builder, path, handler, }: {
        builder: _fadmin.FunctionBuilder;
        path: DP;
        handler: FunTypes.FirestoreTrigger.OnCreateOrDeleteHandler<STypes.FTDocDataAt<S, F, L>, STypes.DocDataAt<S, F, L>>;
    }): _fadmin.CloudFunction<_admin.QueryDocumentSnapshot>;
    onDelete<DP extends string, L extends string = ParseDocumentPath<DP>>({ builder, path, handler, }: {
        builder: _fadmin.FunctionBuilder;
        path: DP;
        handler: FunTypes.FirestoreTrigger.OnCreateOrDeleteHandler<STypes.FTDocDataAt<S, F, L>, STypes.DocDataAt<S, F, L>>;
    }): _fadmin.CloudFunction<_admin.QueryDocumentSnapshot>;
    onUpdate<DP extends string, L extends string = ParseDocumentPath<DP>>({ builder, path, handler, }: {
        builder: _fadmin.FunctionBuilder;
        path: DP;
        handler: FunTypes.FirestoreTrigger.OnUpdateHandler<STypes.FTDocDataAt<S, F, L>, STypes.DocDataAt<S, F, L>>;
    }): _fadmin.CloudFunction<_fadmin.Change<_admin.QueryDocumentSnapshot>>;
    onWrite<DP extends string, L extends string = ParseDocumentPath<DP>>({ builder, path, handler, }: {
        builder: _fadmin.FunctionBuilder;
        path: DP;
        handler: FunTypes.FirestoreTrigger.OnWriteHandler<STypes.FTDocDataAt<S, F, L>, STypes.DocDataAt<S, F, L>>;
    }): _fadmin.CloudFunction<_fadmin.Change<_admin.DocumentSnapshot>>;
}
export {};
