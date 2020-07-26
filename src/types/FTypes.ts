import { fadmin, fweb } from './_firestore'

export declare namespace FTypes {
  export type Env<F, W, A> = F extends fweb.Firestore ? W : A
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

  export type FirestoreApp = fweb.Firestore | fadmin.Firestore

  export type FieldValue<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.FieldValue,
    fadmin.FieldValue
  >
  export type Timestamp<F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.Timestamp,
    fadmin.Timestamp
  >

  export type FieldValueClass =
    | typeof fweb.FieldValue
    | typeof fadmin.FieldValue
  export type TimestampClass = typeof fweb.Timestamp | typeof fadmin.Timestamp

  export type SetOptions = fweb.SetOptions | FirebaseFirestore.SetOptions
  export type DocumentData = fweb.DocumentData | fadmin.DocumentData
  export type CollectionRef<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.CollectionReference<T>,
    fadmin.CollectionReference<T>
  >
  export type Query<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.Query<T>,
    fadmin.Query<T>
  >
  export type FirestoreDataConverter<
    T,
    F extends FirestoreApp = FirestoreApp
  > = Env<
    F,
    fweb.FirestoreDataConverter<T>,
    FirebaseFirestore.FirestoreDataConverter<T>
  >

  export type DocumentRef<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.DocumentReference<T>,
    fadmin.DocumentReference<T>
  >
  export type DocumentSnap<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.DocumentSnapshot<T>,
    fadmin.DocumentSnapshot<T>
  >
  export type QuerySnap<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.QuerySnapshot<T>,
    fadmin.QuerySnapshot<T>
  >
  export type QueryDocumentSnap<T, F extends FirestoreApp = FirestoreApp> = Env<
    F,
    fweb.QueryDocumentSnapshot<T>,
    fadmin.QueryDocumentSnapshot<T>
  >
  export type SnapshotOptions = fweb.SnapshotOptions

  export type Transaction<F extends FirestoreApp> = Env<
    F,
    fweb.Transaction,
    fadmin.Transaction
  >

  export type SetResult<F extends FirestoreApp> = Env<
    F,
    ReturnType<fweb.DocumentReference['set']>,
    ReturnType<fadmin.DocumentReference['set']>
  >
}
