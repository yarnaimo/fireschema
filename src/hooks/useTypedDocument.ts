import { useMemo, useRef } from 'react'
import {
  ObservableStatus,
  useFirestoreDoc,
  useFirestoreDocOnce,
} from 'reactfire'
import { Except } from 'type-fest'

import {
  DocumentSnapDataOptions,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
} from '../core/index.js'
import { _web } from '../lib/firestore-types.js'
import { useDocumentSnapData } from './useSnapData.js'
import { useFirestoreErrorLogger, useSafeRef } from './utils.js'

export type UseTypedDoc<
  S extends STypes.RootOptions.All,
  L extends string,
  U = STypes.DocDataAt<S, _web.Firestore, L>,
  V = U,
> = {
  typedRef: TypedDocumentRef<S, _web.Firestore, L, U>
  snap: TypedDocumentSnap<S, _web.Firestore, L, U>
  data: V | undefined
} & Except<ObservableStatus<unknown>, 'data'>

const createUseTypedDocHook = (
  hook: typeof useFirestoreDoc | typeof useFirestoreDocOnce,
) => {
  return <S extends STypes.RootOptions.All, L extends string, U, V = U>(
    typedRef: TypedDocumentRef<S, _web.Firestore, L, U>,
    dataOptions: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
  ): UseTypedDoc<S, L, U, V> => {
    const { safeRef, refChanged } = useSafeRef(typedRef.raw)

    const memoizedTypedRef = useRef<typeof typedRef>()
    if (refChanged) {
      memoizedTypedRef.current = typedRef
    }

    const status = hook(safeRef, { suspense: true })
    useFirestoreErrorLogger(status.error)

    const { snap, data } = useDocumentSnapData(
      typedRef,
      status.data,
      dataOptions,
    )

    return useMemo(() => {
      refChanged
      return { ...status, typedRef: memoizedTypedRef.current!, snap, data }
    }, [data, refChanged, snap, status])
  }
}

export const useTypedDoc = createUseTypedDocHook(useFirestoreDoc)
export const useTypedDocOnce = createUseTypedDocHook(useFirestoreDocOnce)
