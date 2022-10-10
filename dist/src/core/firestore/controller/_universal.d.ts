import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
} from 'firebase/firestore'
import { FTypes } from '../../types/index.js'
import { QueryBuilder, QueryConstraintUniv } from './_query.js'
export declare const collectionUniv: (
  raw: FTypes.FirestoreApp | FTypes.DocumentRef<any>,
  collectionName: string,
) =>
  | CollectionReference<import('@firebase/firestore').DocumentData>
  | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
export declare const collectionGroupUniv: (
  raw: FTypes.FirestoreApp,
  collectionName: string,
) =>
  | Query<import('@firebase/firestore').DocumentData>
  | FirebaseFirestore.CollectionGroup<FirebaseFirestore.DocumentData>
export declare const runTransactionUniv: <T>(
  raw: FTypes.FirestoreApp,
  fn: (transaction: FTypes.Transaction<FTypes.FirestoreApp>) => Promise<T>,
) => Promise<T>
export declare const writeBatchUniv: (
  raw: FTypes.FirestoreApp,
) => import('@firebase/firestore').WriteBatch | FirebaseFirestore.WriteBatch
export declare const docUniv: (
  raw: FTypes.CollectionRef<any>,
  _id: string | undefined,
) => DocumentReference<any> | FirebaseFirestore.DocumentReference<any>
export declare const docFromRootUniv: (
  raw: FTypes.FirestoreApp,
  id: string,
) =>
  | FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  | DocumentReference<import('@firebase/firestore').DocumentData>
export declare const existsUniv: (raw: FTypes.DocumentSnap<any>) => boolean
export declare const setDocUniv: (
  raw: FTypes.DocumentRef<any>,
  ...args: any[]
) => Promise<void | FirebaseFirestore.WriteResult>
export declare const updateDocUniv: (
  raw: FTypes.DocumentRef<any>,
  data: any,
) => Promise<void | FirebaseFirestore.WriteResult>
export declare const deleteDocUniv: (
  raw: FTypes.DocumentRef<any>,
) => Promise<void | FirebaseFirestore.WriteResult>
export declare type GetSource = 'server' | 'cache' | undefined
export declare const getDocUniv: (
  raw: FTypes.DocumentRef<any>,
  from: GetSource,
) => Promise<FirebaseFirestore.DocumentSnapshot<any> | DocumentSnapshot<any>>
export declare const getDocsUniv: (
  raw: FTypes.Query<any>,
  from: GetSource,
) => Promise<
  | import('@firebase/firestore').QuerySnapshot<any>
  | FirebaseFirestore.QuerySnapshot<any>
>
export declare const queryUniv: (
  raw: FTypes.Query<any>,
  constraints: QueryConstraintUniv[],
) => Query<any> | FirebaseFirestore.Query<any>
export declare const queryBuilderUniv: (
  raw: FTypes.Query<any>,
) => import('type-fest').Simplify<
  import('type-fest/source/merge').Merge_<
    {
      endAt: typeof import('@firebase/firestore').endAt
      endBefore: typeof import('@firebase/firestore').endBefore
      limit: typeof import('@firebase/firestore').limit
      limitToLast: typeof import('@firebase/firestore').limitToLast
      orderBy: typeof import('@firebase/firestore').orderBy
      startAfter: typeof import('@firebase/firestore').startAfter
      startAt: typeof import('@firebase/firestore').startAt
      where: typeof import('@firebase/firestore').where
    },
    {
      where: import('./_query.js').Where<string>
    }
  >
>
export declare const buildQueryUniv: (
  raw: FTypes.Query<any>,
  fn: (q: QueryBuilder<string>) => QueryConstraintUniv[],
) => Query<any> | FirebaseFirestore.Query<any>
export declare const refEqualUniv: <
  T extends
    | DocumentReference<any>
    | FirebaseFirestore.DocumentReference<any>
    | CollectionReference<any>
    | FirebaseFirestore.CollectionReference<any>,
>(
  left: T,
  right: T,
) => boolean
export declare const queryEqualUniv: (
  left: FTypes.Query<any>,
  right: FTypes.Query<any>,
) => boolean
