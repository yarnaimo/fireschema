import {
  endAt,
  endBefore,
  limit,
  limitToLast,
  orderBy,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore'

export type QueryBuilder = typeof queryBuilderWeb

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
