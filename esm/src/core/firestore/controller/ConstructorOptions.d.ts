import { FTypes, STypes } from '../../types/index.js';
import { FirestoreStatic } from './_static.js';
export declare type TypedConstructorOptions<S extends STypes.RootOptions.All, F extends FTypes.FirestoreApp, L extends string> = {
    schemaOptions: S;
    firestoreStatic: FirestoreStatic<F>;
    loc: L;
};
export declare type TypedConstructorOptionsWithoutLoc<S extends STypes.RootOptions.All, F extends FTypes.FirestoreApp> = {
    schemaOptions: S;
    firestoreStatic: FirestoreStatic<F>;
};
