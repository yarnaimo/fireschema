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
  F extends _web.Firestore,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
  V = U,
> = {
  snap: TypedDocumentSnap<S, F, L, U>
  data: V | undefined
} & Except<ObservableStatus<unknown>, 'data'>

const createUseTypedDocHook = (
  hook: typeof useFirestoreDoc | typeof useFirestoreDocOnce,
) => {
  return <S extends STypes.RootOptions.All, L extends string, U, V = U>(
    typedDoc: TypedDocumentRef<S, _web.Firestore, L, U>,
    dataOptions: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
  ): UseTypedDoc<S, _web.Firestore, L, U, V> => {
    const { safeRef } = useSafeRef(typedDoc.raw)

    const { data: _snap, error, ...status } = hook(safeRef, { suspense: true })
    useFirestoreErrorLogger(error)

    const { snap, data } = useDocumentSnapData(typedDoc, _snap, dataOptions)

    return { snap, data, error, ...status }
  }
}

export const useTypedDoc = createUseTypedDocHook(useFirestoreDoc)
export const useTypedDocOnce = createUseTypedDocHook(useFirestoreDocOnce)
