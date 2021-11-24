import {
  useCollection,
  useCollectionOnce,
} from 'react-firebase-hooks/firestore'
import {
  OnceOptions,
  Options,
} from 'react-firebase-hooks/firestore/dist/firestore/types'

import {
  QueryDocumentSnapDataOptions,
  STypes,
  TypedQueryRef,
  TypedQuerySnap,
} from '../core/index.js'
import { _web } from '../lib/firestore-types.js'
import { useQuerySnapData } from './useSnapData.js'
import { useFirestoreErrorLogger, useSafeRef } from './utils.js'

export type UseTypedQuery<
  S extends STypes.RootOptions.All,
  F extends _web.Firestore,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
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
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U> | undefined,
  {
    getOptions,
    ...dataOptions
  }: OnceOptions &
    QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { safeRef, refChanged } = useSafeRef(typedQuery?.raw)

  const [_snap, _loading, error] = useCollectionOnce<U>(safeRef, {
    getOptions,
  })
  const loading = _loading || refChanged

  useFirestoreErrorLogger(error)
  const { snap, data } = useQuerySnapData(typedQuery, _snap, dataOptions)

  return { snap, data, loading, error }
}

export const useTypedQuery = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U> | undefined,
  {
    snapshotListenOptions,
    ...dataOptions
  }: Options & QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { safeRef, refChanged } = useSafeRef(typedQuery?.raw)

  const [_snap, _loading, error] = useCollection<U>(safeRef, {
    snapshotListenOptions,
  })
  const loading = _loading || refChanged

  useFirestoreErrorLogger(error)
  const { snap, data } = useQuerySnapData(typedQuery, _snap, dataOptions)

  return { snap, data, loading, error }
}
