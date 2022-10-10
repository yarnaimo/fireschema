import { _admin, _web } from '../../lib/firestore-types.js';
export declare namespace FTypes {
    type Env<F, W, A> = F extends _web.Firestore ? W : A;
    type DocumentValue = DocumentObject | string | number | boolean | null | Date | DocumentValue[] | Timestamp | DocumentRef<DocumentObject>;
    type DocumentObject = {
        [key: string]: DocumentValue;
    };
    type FirestoreApp = _web.Firestore | _admin.Firestore;
    type FieldValue<F extends FirestoreApp = FirestoreApp> = Env<F, _web.FieldValue, _admin.FieldValue>;
    type Timestamp<F extends FirestoreApp = FirestoreApp> = Env<F, _web.Timestamp, _admin.Timestamp>;
    type FieldValueClass<F extends FirestoreApp = FirestoreApp> = Env<F, typeof _web.FieldValue, typeof _admin.FieldValue>;
    type TimestampClass<F extends FirestoreApp = FirestoreApp> = Env<F, typeof _web.Timestamp, typeof _admin.Timestamp>;
    type SetOptions = _web.SetOptions | FirebaseFirestore.SetOptions;
    type DocumentData = _web.DocumentData | _admin.DocumentData;
    type CollectionRef<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.CollectionReference<T>, _admin.CollectionReference<T>>;
    type Query<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.Query<T>, _admin.Query<T>>;
    type FirestoreDataConverter<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.FirestoreDataConverter<T>, FirebaseFirestore.FirestoreDataConverter<T>>;
    type DocumentRef<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.DocumentReference<T>, _admin.DocumentReference<T>>;
    type DocumentSnap<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.DocumentSnapshot<T>, _admin.DocumentSnapshot<T>>;
    type QuerySnap<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.QuerySnapshot<T>, _admin.QuerySnapshot<T>>;
    type QueryDocumentSnap<T, F extends FirestoreApp = FirestoreApp> = Env<F, _web.QueryDocumentSnapshot<T>, _admin.QueryDocumentSnapshot<T>>;
    type SnapshotOptions<F extends FirestoreApp = FirestoreApp> = Env<F, _web.SnapshotOptions, {} | undefined>;
    type Transaction<F extends FirestoreApp> = Env<F, _web.Transaction, _admin.Transaction>;
    type WriteBatch<F extends FirestoreApp> = Env<F, _web.WriteBatch, _admin.WriteBatch>;
    type WriteResult<F extends FirestoreApp> = Env<F, void, _admin.WriteResult>;
    type WriteResultArray<F extends FirestoreApp> = Env<F, void, _admin.WriteResult[]>;
}
