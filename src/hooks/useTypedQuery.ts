import { ObservableStatus, useFirestoreCollection } from 'reactfire'
import { Except } from 'type-fest'

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
  snap: TypedQuerySnap<S, F, L, U>
  data: V[]
} & Except<ObservableStatus<unknown>, 'data'>

export const useTypedQuery = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U>,
  dataOptions: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { safeRef } = useSafeRef(typedQuery.raw)

  const {
    data: _snap,
    error,
    ...status
  } = useFirestoreCollection(safeRef, { suspense: true })
  useFirestoreErrorLogger(error)

  const { snap, data } = useQuerySnapData(typedQuery, _snap, dataOptions)

  return { snap, data, error, ...status }
}
