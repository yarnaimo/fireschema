import { useEffect, useMemo } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import {
  FTypes,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
  TypedQueryRef,
  TypedQuerySnap,
} from '../core'
import { _web } from '../lib/firestore-types'
import {
  DocumentSnapTransformer,
  QueryDocumentSnapTransformer,
  useDocumentSnapData,
  useQuerySnapData,
} from './useSnapData'
import { useRefChangeLimitExceeded } from './utils'

export type UseTypedDocument<
  S extends STypes.RootOptions.All,
  F extends _web.Firestore,
  L extends string,
  U,
  V = U,
> = {
  data: V | undefined
  snap: TypedDocumentSnap<S, F, L, U> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedDocument = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedDoc: TypedDocumentRef<S, _web.Firestore, L, U> | null | undefined,
  transformer?: DocumentSnapTransformer<S, L, U, V>,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
    snapshotOptions?: _web.SnapshotOptions
  },
): UseTypedDocument<S, _web.Firestore, L, U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(typedDoc?.raw)

  const [_snap, loading, error] = useDocument<U>(
    exceeded() ? undefined : typedDoc?.raw,
    options,
  )

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  const snap = useMemo(() => {
    if (!typedDoc || !_snap) {
      return undefined
    }
    return new TypedDocumentSnap(
      typedDoc.schemaOptions,
      typedDoc.firestoreStatic,
      typedDoc.loc,
      _snap as FTypes.DocumentSnap<U, _web.Firestore>,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_snap])

  const data = useDocumentSnapData(snap, transformer, options?.snapshotOptions)

  return { data, snap, loading, error }
}

export type UseTypedQuery<
  S extends STypes.RootOptions.All,
  F extends _web.Firestore,
  L extends string,
  U,
  V = U,
> = {
  data: V[] | undefined
  snap: TypedQuerySnap<S, F, L, U> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedQuery = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U> | null | undefined,
  transformer?: QueryDocumentSnapTransformer<S, L, U, V>,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
    snapshotOptions?: _web.SnapshotOptions
  },
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(typedQuery?.raw)

  const [_snap, loading, error] = useCollection<U>(
    exceeded() ? undefined : typedQuery?.raw,
    options,
  )

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  const snap = useMemo(() => {
    if (!typedQuery || !_snap) {
      return undefined
    }
    return new TypedQuerySnap(
      typedQuery.schemaOptions,
      typedQuery.firestoreStatic,
      typedQuery.loc,
      _snap as FTypes.QuerySnap<U, _web.Firestore>,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_snap])

  const data = useQuerySnapData(snap, transformer, options?.snapshotOptions)

  return { data, snap, loading, error }
}
