import {
  useCollection,
  useCollectionOnce,
} from 'react-firebase-hooks/firestore'

import {
  QueryDocumentSnapDataOptions,
  STypes,
  TypedQueryRef,
  TypedQuerySnap,
} from '../core/index.js'
import { _web } from '../lib/firestore-types'
import { useQuerySnapData } from './useSnapData.js'
import {
  HasGetOptions,
  HasSnapListenOptions,
  useFirestoreErrorLogger,
  useRefChangeLimitExceeded,
} from './utils.js'

export type UseTypedQuery<
  S extends STypes.RootOptions.All,
  F extends _web.Firestore,
  L extends string,
  U,
  V = U,
> = {
  snap: TypedQuerySnap<S, F, L, U> | undefined
  data: V[] | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedQueryOnce = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U> | null | undefined,
  {
    getOptions,
    ...dataOptions
  }: HasGetOptions &
    QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { safeRef } = useRefChangeLimitExceeded(typedQuery?.raw)

  const [_snap, loading, error] = useCollectionOnce<U>(safeRef(), {
    getOptions,
  })
  // FIXME: remove as any
  useFirestoreErrorLogger(error as any)
  const { snap, data } = useQuerySnapData(typedQuery, _snap, dataOptions)

  return { snap, data, loading, error }
}

export const useTypedQuery = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U> | null | undefined,
  {
    snapshotListenOptions,
    ...dataOptions
  }: HasSnapListenOptions &
    QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { safeRef } = useRefChangeLimitExceeded(typedQuery?.raw)

  const [_snap, loading, error] = useCollection<U>(safeRef(), {
    snapshotListenOptions,
  })
  // FIXME: remove as any
  useFirestoreErrorLogger(error as any)
  const { snap, data } = useQuerySnapData(typedQuery, _snap, dataOptions)

  return { snap, data, loading, error }
}
