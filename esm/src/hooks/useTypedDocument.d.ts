import { DocumentSnapDataOptions, STypes, TypedDocumentRef, TypedDocumentSnap } from '../core/index.js';
import { _web } from '../lib/firestore-types.js';
export declare type UseTypedDoc<S extends STypes.RootOptions.All, L extends string, U = STypes.DocDataAt<S, _web.Firestore, L>, V = U> = {
    ref: TypedDocumentRef<S, _web.Firestore, L, U>;
    snap: TypedDocumentSnap<S, _web.Firestore, L, U>;
    data: V | undefined;
    error: Error | undefined;
};
export declare const useTypedDoc: <S extends STypes.RootOptions.All, L extends string, U, V = U>(typedRef: TypedDocumentRef<S, _web.Firestore, L, U>, { suspense, ...dataOptions }?: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> & {
    suspense?: boolean | undefined;
}) => UseTypedDoc<S, L, U, V>;
export declare const useTypedDocOnce: <S extends STypes.RootOptions.All, L extends string, U, V = U>(typedRef: TypedDocumentRef<S, _web.Firestore, L, U>, { suspense, ...dataOptions }?: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> & {
    suspense?: boolean | undefined;
}) => UseTypedDoc<S, L, U, V>;
