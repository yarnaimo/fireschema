import { STypes } from '../../types/index.js';
import { FirestoreModel } from '../model.js';
export declare const renderRoot: (functions: STypes.FunctionsRenderOptions, collectionGroups: STypes.CollectionOptions.GroupChildren, collections: STypes.CollectionOptions.Children) => (string | null)[];
export declare const renderSchema: <S extends STypes.RootOptions.All>({ schemaOptions: { collectionGroups, ...options }, }: FirestoreModel<S>) => string;
