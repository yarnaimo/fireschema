import { useDocument, useDocumentOnce } from 'react-firebase-hooks/firestore'
import {
  OnceOptions,
  Options,
} from 'react-firebase-hooks/firestore/dist/firestore/types'

import {
  DocumentSnapDataOptions,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
} from '../core/index.js'
import { _web } from '../lib/firestore-types.js'
import { useDocumentSnapData } from './useSnapData.js'
import { useFirestoreErrorLogger, useRefChangeLimitExceeded } from './utils.js'

export type UseTypedDocument<
  S extends STypes.RootOptions.All,
  F extends _web.Firestore,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
  V = U,
> = {
  snap: TypedDocumentSnap<S, F, L, U> | undefined
  data: V | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedDocumentOnce = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedDoc: TypedDocumentRef<S, _web.Firestore, L, U> | null | undefined,
  {
    getOptions,
    ...dataOptions
  }: OnceOptions & DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedDocument<S, _web.Firestore, L, U, V> => {
  const { safeRef } = useRefChangeLimitExceeded(typedDoc?.raw)

  const [_snap, loading, error] = useDocumentOnce<U>(safeRef(), {
    getOptions,
  })
  useFirestoreErrorLogger(error)
  const { snap, data } = useDocumentSnapData(typedDoc, _snap, dataOptions)

  return { snap, data, loading, error }
}

export const useTypedDocument = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedDoc: TypedDocumentRef<S, _web.Firestore, L, U> | null | undefined,
  {
    snapshotListenOptions,
    ...dataOptions
  }: Options & DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedDocument<S, _web.Firestore, L, U, V> => {
  const { safeRef } = useRefChangeLimitExceeded(typedDoc?.raw)

  const [_snap, loading, error] = useDocument<U>(safeRef(), {
    snapshotListenOptions,
  })
  useFirestoreErrorLogger(error)
  const { snap, data } = useDocumentSnapData(typedDoc, _snap, dataOptions)

  return { snap, data, loading, error }
}
