import { useMemo, useRef } from 'react'
import { useFirestoreDoc, useFirestoreDocOnce } from 'reactfire'

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
  ref: TypedDocumentRef<S, _web.Firestore, L, U>
  snap: TypedDocumentSnap<S, _web.Firestore, L, U>
  data: V | undefined
  error: Error | undefined
}

const createUseTypedDocHook = (
  hook: typeof useFirestoreDoc | typeof useFirestoreDocOnce,
) => {
  return <S extends STypes.RootOptions.All, L extends string, U, V = U>(
    typedRef: TypedDocumentRef<S, _web.Firestore, L, U>,
    {
      suspense = true,
      ...dataOptions
    }: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> & {
      suspense?: boolean
    } = {},
  ): UseTypedDoc<S, L, U, V> => {
    const { safeRef, refChanged } = useSafeRef(typedRef.raw)

    const memoizedTypedRef = useRef<typeof typedRef>()
    if (refChanged) {
      memoizedTypedRef.current = typedRef
    }

    const { data: _snap, error } = hook(safeRef, { suspense })
    useFirestoreErrorLogger(error)

    const { snap, data } = useDocumentSnapData(typedRef, _snap, dataOptions)

    return useMemo(() => {
      refChanged
      return { ref: memoizedTypedRef.current!, snap, data, error }
    }, [data, error, refChanged, snap])
  }
}

export const useTypedDoc = createUseTypedDocHook(useFirestoreDoc)
export const useTypedDocOnce = createUseTypedDocHook(useFirestoreDocOnce)
