import { fadmin, fweb } from './_firestore'

export declare namespace FireTypes {
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

  type DocFieldToWrite<T, F extends Firestore = Firestore> = T extends Timestamp
    ? Timestamp<F>
    : T

  export type DocDataToWrite<T, F extends Firestore = Firestore> = {
    [K in keyof T]: DocFieldToWrite<T[K], F> | FieldValue<F>
  }

  export type Firestore = fweb.Firestore | fadmin.Firestore

  export type FieldValue<F extends Firestore = Firestore> = Env<
    F,
    fweb.FieldValue,
    fadmin.FieldValue
  >
  export type Timestamp<F extends Firestore = Firestore> = Env<
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
  export type CollectionRef<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.CollectionReference<T>,
    fadmin.CollectionReference<T>
  >
  export type Query<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.Query<T>,
    fadmin.Query<T>
  >
  export type FirestoreDataConverter<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.FirestoreDataConverter<T>,
    FirebaseFirestore.FirestoreDataConverter<T>
  >

  export type DocumentRef<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.DocumentReference<T>,
    fadmin.DocumentReference<T>
  >
  export type DocumentSnap<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.DocumentSnapshot<T>,
    fadmin.DocumentSnapshot<T>
  >
  export type QuerySnap<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.QuerySnapshot<T>,
    fadmin.QuerySnapshot<T>
  >
  export type QueryDocumentSnap<T, F extends Firestore = Firestore> = Env<
    F,
    fweb.QueryDocumentSnapshot<T>,
    fadmin.QueryDocumentSnapshot<T>
  >
  export type SnapshotOptions = fweb.SnapshotOptions

  export type Transaction<F extends Firestore> = Env<
    F,
    fweb.Transaction,
    fadmin.Transaction
  >

  export type SetResult<F extends Firestore> = Env<
    F,
    ReturnType<fweb.DocumentReference['set']>,
    ReturnType<fadmin.DocumentReference['set']>
  >
}
