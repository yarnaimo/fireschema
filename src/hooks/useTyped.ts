import { useEffect, useMemo } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import {
  DocumentSnapDataOptions,
  FTypes,
  QueryDocumentSnapDataOptions,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
  TypedQueryRef,
  TypedQuerySnap,
} from '../core'
import { _web } from '../lib/firestore-types'
import { useDocumentSnapData, useQuerySnapData } from './useSnapData'
import { useRefChangeLimitExceeded } from './utils'

type HasSnapshotListenOptions = {
  snapshotListenOptions?: _web.SnapshotListenOptions
}

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
  {
    snapshotListenOptions,
    ...dataOptions
  }: HasSnapshotListenOptions &
    DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedDocument<S, _web.Firestore, L, U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(typedDoc?.raw)

  const [_snap, loading, error] = useDocument<U>(
    exceeded() ? undefined : typedDoc?.raw,
    { snapshotListenOptions },
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

  const data = useDocumentSnapData(snap, dataOptions)

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
  {
    snapshotListenOptions,
    ...dataOptions
  }: HasSnapshotListenOptions &
    QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): UseTypedQuery<S, _web.Firestore, L, U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(typedQuery?.raw)

  const [_snap, loading, error] = useCollection<U>(
    exceeded() ? undefined : typedQuery?.raw,
    { snapshotListenOptions },
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

  const data = useQuerySnapData(snap, dataOptions)

  return { data, snap, loading, error }
}
