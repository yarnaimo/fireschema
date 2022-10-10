import {
  QueryConstraint,
  WhereFilterOp,
  endAt,
  endBefore,
  limit,
  limitToLast,
  orderBy,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore'
import { Merge } from 'type-fest'
export declare type QueryBuilder<K> = Merge<
  typeof queryBuilderWeb,
  {
    where: Where<K>
  }
>
export declare const queryBuilderWeb: {
  endAt: typeof endAt
  endBefore: typeof endBefore
  limit: typeof limit
  limitToLast: typeof limitToLast
  orderBy: typeof orderBy
  startAfter: typeof startAfter
  startAt: typeof startAt
  where: typeof where
}
export declare type Where<K> = (
  fieldPath: K,
  opStr: WhereFilterOp,
  value: unknown,
) => QueryConstraint
export declare type QueryConstraintAdmin = ReturnType<
  typeof queryBuilderAdmin[string]
>
export declare type QueryConstraintUniv = QueryConstraint | QueryConstraintAdmin
export declare const queryBuilderAdmin: {
  [k: string]: (...args: any[]) => (q: FirebaseFirestore.Query) => any
}
export declare const queryAdmin: <T>(
  query: FirebaseFirestore.Query<T>,
  ...queryConstraints: QueryConstraintAdmin[]
) => FirebaseFirestore.Query<T>
