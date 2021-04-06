import { _admin, _web } from '../../lib/firestore-types'

export declare namespace FTypes {
  export type Env<F, W, A> = F extends _web.Firestore ? W : A
  export type DocumentValue =
    | DocumentObject
    | string
    | number
    | boolean
    | null
    | Date
    | DocumentValue[]
    | Timestamp
    | DocumentRef<DocumentObject>

  export type DocumentObject = { [key: string]: DocumentValue }

  export type FirestoreStatic<F extends FirestoreApp> = Env<
    F,
    typeof _web,
    typeof _admin
  >
  export type FirestoreApp = _web.Firestore | _admin.Firestore

  export type FieldValue<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.FieldValue,
    _admin.FieldValue
  >
  export type Timestamp<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.Timestamp,
    _admin.Timestamp
  >

  export type FieldValueClass<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    typeof _web.FieldValue,
    typeof _admin.FieldValue
  >
  export type TimestampClass<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    typeof _web.Timestamp,
    typeof _admin.Timestamp
  >

  export type SetOptions = _web.SetOptions | FirebaseFirestore.SetOptions
  export type DocumentData = _web.DocumentData | _admin.DocumentData
  export type CollectionRef<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.CollectionReference<T>,
    _admin.CollectionReference<T>
  >
  export type Query<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.Query<T>,
    _admin.Query<T>
  >
  export type FirestoreDataConverter<
    T,
    F extends FirestoreApp = FirestoreApp
  > = Env<
    F,
    _web.FirestoreDataConverter<T>,
    FirebaseFirestore.FirestoreDataConverter<T>
  >

  export type DocumentRef<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.DocumentReference<T>,
    _admin.DocumentReference<T>
  >
  export type DocumentSnap<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.DocumentSnapshot<T>,
    _admin.DocumentSnapshot<T>
  >
  export type QuerySnap<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.QuerySnapshot<T>,
    _admin.QuerySnapshot<T>
  >
  export type QueryDocumentSnap<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.QueryDocumentSnapshot<T>,
    _admin.QueryDocumentSnapshot<T>
  >
  export type SnapshotOptions<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    _web.SnapshotOptions,
    undefined
  >

  export type Transaction<F extends FirestoreApp> = Env<
    F,
    _web.Transaction,
    _admin.Transaction
  >
  export type WriteBatch<F extends FirestoreApp> = Env<
    F,
    _web.WriteBatch,
    _admin.WriteBatch
  >

  export type SetResult<F extends FirestoreApp> = Env<
    F,
    ReturnType<_web.DocumentReference['set']>,
    ReturnType<_admin.DocumentReference['set']>
  >
}
