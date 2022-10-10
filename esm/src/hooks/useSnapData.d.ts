import { DocumentSnapDataOptions, QueryDocumentSnapDataOptions, STypes, TypedDocumentRef, TypedDocumentSnap, TypedQueryRef, TypedQuerySnap } from '../core/index.js';
import { _web } from '../lib/firestore-types.js';
export declare const useDocumentSnapData: <S extends STypes.RootOptions.All, L extends string, U, V = U>(typedDoc: TypedDocumentRef<S, _web.Firestore, L, U>, _snap: _web.DocumentSnapshot<U>, { transformer, snapshotOptions, }?: DocumentSnapDataOptions<S, _web.Firestore, L, U, V>) => {
    snap: TypedDocumentSnap<S, _web.Firestore, L, U>;
    data: V | undefined;
};
export declare const useQuerySnapData: <S extends STypes.RootOptions.All, L extends string, U, V = U>(typedQuery: TypedQueryRef<S, _web.Firestore, L, U>, _snap: _web.QuerySnapshot<U>, { transformer, snapshotOptions, }: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V>) => {
    snap: TypedQuerySnap<S, _web.Firestore, L, U>;
    data: V[];
};
