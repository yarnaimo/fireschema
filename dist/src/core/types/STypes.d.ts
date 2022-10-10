import { Merge } from 'type-fest';
import { Type } from '../../lib/type.js';
import { QueryBuilder, QueryConstraintUniv } from '../firestore/controller/_query.js';
import { FirestoreStatic } from '../firestore/controller/_static.js';
import { DataModel, InferDataModelSL, InferDataModelT, InferDataModelU, TypedQueryRef } from '../firestore/index.js';
import { FTypes } from './FTypes.js';
import { GetSchemaOptionsByLoc, PlainLoc } from './_object.js';
export declare const allowOptions: {
    read: {
        read: null;
        get: null;
        list: null;
    };
    write: {
        write: null;
        create: null;
        update: null;
        delete: null;
    };
};
export declare namespace STypes {
    type InferDocT<D extends FTypes.FirestoreApp | FTypes.DocumentRef<unknown>> = D extends FTypes.DocumentRef<infer T> ? T : never;
    type InferCollectionT<C extends FTypes.CollectionRef<unknown>> = C extends FTypes.CollectionRef<infer T> ? T : never;
    type GetModelU<_C> = InferDataModelU<EnsureOptions<_C>['model']>;
    type GetModelT<_C> = InferDataModelT<EnsureOptions<_C>['model']>;
    type EnsureOptions<_C> = _C extends CollectionOptions.Meta ? _C : never;
    type GetSL<_C> = InferDataModelSL<EnsureOptions<_C>['model']>;
    type DocDataAt<S extends RootOptions.All, F extends FTypes.FirestoreApp, L extends string> = DocData<F, GetModelU<GetSchemaOptionsByLoc<S, L>>, L, GetModelT<GetSchemaOptionsByLoc<S, L>>>;
    type FTDocDataAt<S extends RootOptions.All, F extends FTypes.FirestoreApp, L extends string> = DocData<F, GetModelT<GetSchemaOptionsByLoc<S, L>>, L, GetModelT<GetSchemaOptionsByLoc<S, L>>>;
    type DocData<F extends FTypes.FirestoreApp, U, L extends string, T> = DocumentMeta<F> & U & HasLoc<L> & HasT<T> & HasId;
    type ConditionExp = string | boolean;
    type FunctionsOptions = {
        [key: `function ${string}`]: string;
    };
    type FunctionsRenderOptions = {
        [key: string]: string;
    };
    namespace RootOptions {
        type Meta = FunctionsOptions & {
            collectionGroups: CollectionOptions.GroupChildren;
        };
        type All = Meta & CollectionOptions.Children;
    }
    namespace CollectionOptions {
        type Meta = FunctionsOptions & {
            model: DataModel<any, any, STypes.Model.SelectorsConstraint>;
            allow: AllowOptions;
        };
        type GroupMeta = Merge<Meta, {
            model?: never;
        }>;
        type Children = {
            [K in `/${string}/{${string}}`]: All;
        };
        type GroupChildren = {
            [K in `/${string}/{${string}}`]: GroupMeta;
        };
        type All = Meta & Children;
    }
    type AllowOptions = {
        [K in keyof (typeof allowOptions.read & typeof allowOptions.write)]+?: ConditionExp;
    };
    namespace Model {
        type Decoder<T, U> = (data: T, snapshot: FTypes.QueryDocumentSnap<T>) => U;
        type Selectors<T, SL extends SelectorsConstraint> = (q: QueryBuilder<FieldPath<T>>, firestoreStatic: FirestoreStatic<FTypes.FirestoreApp>) => SL;
        type SelectorsConstraint = {
            [key: string]: (...args: any[]) => QueryConstraintUniv[];
        };
    }
    type FieldPath<T> = PlainLoc<T> | keyof DocumentMeta;
    type MappedSelectors<S extends STypes.RootOptions.All, F extends FTypes.FirestoreApp, L extends string, U = STypes.DocDataAt<S, F, L>, SL = STypes.GetSL<GetSchemaOptionsByLoc<S, L>>> = {
        [K in keyof SL]: SL[K] extends (...args: infer A) => any ? (...args: A) => TypedQueryRef<S, F, L, U> : never;
    };
    type HasLoc<L extends string> = {
        __loc__: L;
    };
    type HasT<T> = {
        __T__: T;
    };
    type HasId = {
        id: string;
    };
    type DocumentMeta<F extends FTypes.FirestoreApp = FTypes.FirestoreApp> = {
        _createdAt: FTypes.Timestamp<F>;
        _updatedAt: FTypes.Timestamp<F>;
    };
    type WithoutLoc<T> = T extends HasLoc<any> ? Type.Except<T, '__loc__'> : T;
    type WithoutMeta<T> = T extends DocumentMeta ? Type.Except<T, keyof DocumentMeta> : T;
    type WriteDataField<T, F extends FTypes.FirestoreApp = FTypes.FirestoreApp> = T extends FTypes.Timestamp ? FTypes.Timestamp<F> : T;
    type WriteData<S extends RootOptions.All, F extends FTypes.FirestoreApp, L extends string, T = DocDataAt<S, F, L>['__T__'], _T = WithoutMeta<WithoutLoc<T>>> = {
        [K in keyof _T]: WriteDataField<_T[K], F> | FTypes.FieldValue<F>;
    };
}
