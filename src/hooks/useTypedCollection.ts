import { useMemo, useRef } from 'react'
import { useFirestoreCollection } from 'reactfire'

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
  L extends string,
  U = STypes.DocDataAt<S, _web.Firestore, L>,
  V = U,
> = {
  ref: TypedQueryRef<S, _web.Firestore, L, U>
  snap: TypedQuerySnap<S, _web.Firestore, L, U>
  data: V[]
  error: Error | undefined
}

export const useTypedCollection = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedRef: TypedQueryRef<S, _web.Firestore, L, U>,
  {
    suspense = true,
    ...dataOptions
  }: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> & {
    suspense?: boolean
  } = {},
): UseTypedQuery<S, L, U, V> => {
  const { safeRef: safeQuery, refChanged } = useSafeRef(typedRef.raw)

  const memoizedTypedRef = useRef<typeof typedRef>()
  if (refChanged) {
    memoizedTypedRef.current = typedRef
  }

  const { data: _snap, error } = useFirestoreCollection(safeQuery, { suspense })
  useFirestoreErrorLogger(error)

  const { snap, data } = useQuerySnapData(typedRef, _snap, dataOptions)

  return useMemo(() => {
    refChanged
    return { ref: memoizedTypedRef.current!, snap, data, error }
  }, [data, error, refChanged, snap])
}
