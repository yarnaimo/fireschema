import { useRef } from 'react'
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
  F extends _web.Firestore,
  L extends string,
  U,
  V,
> = {
  typedRef: TypedCollectionRef<S, _web.Firestore, L, U>
  snap: TypedQuerySnap<S, F, L, U>
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
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const _typedQuery = selector?.(typedRef.select as any) ?? typedRef
  const { safeRef: safeQuery, refChanged } = useSafeRef(_typedQuery.raw)

  const memoizedTypedRef = useRef<typeof typedRef>()
  if (refChanged) {
    memoizedTypedRef.current = typedRef
  }

  const {
    data: _snap,
    error,
    ...status
  } = useFirestoreCollection(safeQuery, { suspense: true })
  useFirestoreErrorLogger(error)

  const { snap, data } = useQuerySnapData(typedRef, _snap, dataOptions)

  return { typedRef: memoizedTypedRef.current!, snap, data, error, ...status }
}
