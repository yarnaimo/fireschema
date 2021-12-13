import { useMemo, useRef } from 'react'
import { ObservableStatus, useFirestoreCollection } from 'reactfire'
import { Except } from 'type-fest'

import {
  QueryDocumentSnapDataOptions,
  STypes,
  TypedCollectionRef,
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
  typedRef: TypedCollectionRef<S, _web.Firestore, L, U>
  snap: TypedQuerySnap<S, _web.Firestore, L, U>
  data: V[]
} & Except<ObservableStatus<unknown>, 'data'>

export const useTypedCollection = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedRef: TypedCollectionRef<S, _web.Firestore, L, U>,
  selector?:
    | ((
        select: STypes.MappedSelectors<S, _web.Firestore, L, U>,
      ) => TypedQueryRef<S, _web.Firestore, L, U>)
    | undefined,
  dataOptions: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, L, U, V> => {
  const _typedQuery = selector?.(typedRef.select as any) ?? typedRef
  const { safeRef: safeQuery, refChanged } = useSafeRef(_typedQuery.raw)

  const memoizedTypedRef = useRef<typeof typedRef>()
  if (refChanged) {
    memoizedTypedRef.current = typedRef
  }

  const status = useFirestoreCollection(safeQuery, { suspense: true })
  useFirestoreErrorLogger(status.error)

  const { snap, data } = useQuerySnapData(typedRef, status.data, dataOptions)

  return useMemo(() => {
    refChanged
    return { ...status, typedRef: memoizedTypedRef.current!, snap, data }
  }, [data, refChanged, snap, status])
}
