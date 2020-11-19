import { useEffect, useMemo } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { _web } from '../lib/firestore-types'
import { useRefChangeLimitExceeded } from './utils'

export type UseTypedDocument<T> = {
  snap: _web.DocumentSnapshot<T> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedDocument = <T>(
  docRef: _web.DocumentReference<T> | null | undefined,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
  },
): UseTypedDocument<T> => {
  const { exceeded } = useRefChangeLimitExceeded(docRef)

  const [snap, loading, error] = useDocument(
    exceeded() ? undefined : docRef,
    options,
  )

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return {
    snap: snap as _web.DocumentSnapshot<T> | undefined,
    loading,
    error,
  }
}

export type UseTypedQuery<T> = {
  snap: _web.QuerySnapshot<T> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedQuery = <T>(
  query: _web.Query<T> | null | undefined,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
  },
): UseTypedQuery<T> => {
  const { exceeded } = useRefChangeLimitExceeded(query)

  const [snap, loading, error] = useCollection(
    exceeded() ? undefined : query,
    options,
  )

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return {
    snap: snap as _web.QuerySnapshot<T> | undefined,
    loading,
    error,
  }
}

export const useQuerySnapData = <T, U = T>(
  querySnap: _web.QuerySnapshot<T> | undefined,
  transformer?: (data: T, snap: _web.QueryDocumentSnapshot<T>) => U,
): U[] | undefined =>
  useMemo(
    () =>
      querySnap?.docs.map((snap) => {
        const data = snap.data({ serverTimestamps: 'estimate' })
        return transformer?.(data, snap) ?? ((data as unknown) as U)
      }),
    [querySnap], // eslint-disable-line
  )

export const useDocumentSnapData = <T, U = T>(
  snap: _web.DocumentSnapshot<T> | undefined,
  transformer?: (data: T, snap: _web.DocumentSnapshot<T>) => U,
): U | undefined =>
  useMemo(
    () => {
      if (!snap) {
        return undefined
      }
      const data = snap.data({ serverTimestamps: 'estimate' })
      if (!data) {
        return undefined
      }
      return transformer?.(data, snap) ?? ((data as unknown) as U)
    },
    [snap], // eslint-disable-line
  )
