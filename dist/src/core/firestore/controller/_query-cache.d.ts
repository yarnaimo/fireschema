import { FTypes } from '../../types/index.js';
import { DataModel } from '../model.js';
export declare const findCachedQuery: (collectionName: string, rawQuery: FTypes.Query<any>) => import("@firebase/firestore").Query<any> | FirebaseFirestore.Query<any> | undefined;
export declare const addQueryCache: (collectionName: string, rawQuery: FTypes.Query<any>, convertedQuery: FTypes.Query<any>) => void;
export declare const withDecoder: <F extends FTypes.FirestoreApp>(rawQuery: FTypes.Env<F, import("@firebase/firestore").Query<any>, FirebaseFirestore.Query<any>>, model: DataModel<any, any, any>, collectionName: string) => FTypes.Env<F, import("@firebase/firestore").Query<any>, FirebaseFirestore.Query<any>>;
