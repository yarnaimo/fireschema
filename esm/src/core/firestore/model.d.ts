import { z } from 'zod';
import { STypes, SchemaType } from '../types/index.js';
declare type GetU<S extends SchemaType._DocData, D> = D extends STypes.Model.Decoder<any, infer U> ? U : z.infer<S>;
export declare type InferDataModelT<M extends DataModel<any, any, any>> = z.infer<M['schema']>;
export declare type InferDataModelU<M extends DataModel<any, any, any>> = GetU<M['schema'], M['decoder']>;
export declare type InferDataModelSL<M extends DataModel<any, any, any>> = ReturnType<M['selectors']>;
export declare class DataModel<S extends SchemaType._DocData, D extends STypes.Model.Decoder<z.infer<S>, any> | undefined = undefined, SL extends STypes.Model.SelectorsConstraint = {}> {
    readonly schema: S;
    readonly decoder: D;
    readonly selectors: STypes.Model.Selectors<z.infer<S>, SL>;
    constructor({ schema, decoder, selectors, }: {
        schema: S;
        decoder?: D;
        selectors?: STypes.Model.Selectors<z.infer<S>, SL>;
    });
}
export declare type InferFirestoreModelS<M extends FirestoreModel<any>> = M extends FirestoreModel<infer S> ? S : never;
export declare class FirestoreModel<S extends STypes.RootOptions.All> {
    readonly schemaOptions: S;
    constructor(schemaOptions: S);
}
export {};
