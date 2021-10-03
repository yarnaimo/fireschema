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

export type QueryBuilder<K> = Merge<typeof queryBuilderWeb, { where: Where<K> }>

export const queryBuilderWeb = {
  endAt,
  endBefore,
  limit,
  limitToLast,
  orderBy,
  startAfter,
  startAt,
  where,
}

export type Where<K> = (
  fieldPath: K,
  opStr: WhereFilterOp,
  value: unknown,
) => QueryConstraint

export type QueryConstraintAdmin = ReturnType<typeof queryBuilderAdmin[string]>

export const queryBuilderAdmin = Object.fromEntries(
  Object.keys(queryBuilderWeb).map((key) => {
    return [
      key,
      (...args: any[]) => {
        return (q: FirebaseFirestore.Query) => (q as any)[key](...args)
      },
    ]
  }),
)

export const queryAdmin = <T>(
  query: FirebaseFirestore.Query<T>,
  ...queryConstraints: QueryConstraintAdmin[]
) => {
  return queryConstraints.reduce((pre, constraint) => {
    return constraint(pre)
  }, query)
}
