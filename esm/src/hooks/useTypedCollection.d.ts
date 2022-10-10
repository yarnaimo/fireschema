import { QueryDocumentSnapDataOptions, STypes, TypedQueryRef, TypedQuerySnap } from '../core/index.js';
import { _web } from '../lib/firestore-types.js';
export declare type UseTypedQuery<S extends STypes.RootOptions.All, L extends string, U = STypes.DocDataAt<S, _web.Firestore, L>, V = U> = {
    ref: TypedQueryRef<S, _web.Firestore, L, U>;
    snap: TypedQuerySnap<S, _web.Firestore, L, U>;
    data: V[];
    error: Error | undefined;
};
export declare const useTypedCollection: <S extends STypes.RootOptions.All, L extends string, U, V = U>(typedRef: TypedQueryRef<S, _web.Firestore, L, U>, { suspense, ...dataOptions }?: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> & {
    suspense?: boolean | undefined;
}) => UseTypedQuery<S, L, U, V>;
