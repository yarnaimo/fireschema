import { useEffect, useMemo } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { _web } from '../lib/firestore-types'
import { useRefChangeLimitExceeded } from './utils'

export type UseTypedDocument<U, V = U> = {
  data: V | undefined
  snap: _web.DocumentSnapshot<U> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedDocument = <U, V = U>(
  docRef: _web.DocumentReference<U> | null | undefined,
  transformer?: (data: U, snap: _web.DocumentSnapshot<U>) => V,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
  },
): UseTypedDocument<U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(docRef)

  const [snap, loading, error] = useDocument<U>(
    exceeded() ? undefined : docRef,
    options,
  )

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  const data = useDocumentSnapData(snap, transformer)

  return { data, snap, loading, error }
}

export type UseTypedQuery<U, V = U> = {
  data: V[] | undefined
  snap: _web.QuerySnapshot<U> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedQuery = <U, V = U>(
  query: _web.Query<U> | null | undefined,
  transformer?: (data: U, snap: _web.DocumentSnapshot<U>) => V,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
  },
): UseTypedQuery<U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(query)

  const [snap, loading, error] = useCollection<U>(
    exceeded() ? undefined : query,
    options,
  )

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  const data = useQuerySnapData(snap, transformer)

  return { data, snap, loading, error }
}

export const useQuerySnapData = <U, V = U>(
  querySnap: _web.QuerySnapshot<U> | undefined,
  transformer?: (data: U, snap: _web.QueryDocumentSnapshot<U>) => V,
): V[] | undefined =>
  useMemo(
    () =>
      querySnap?.docs.map((snap) => {
        const data = snap.data({ serverTimestamps: 'estimate' })
        return transformer?.(data, snap) ?? ((data as unknown) as V)
      }),
    [querySnap], // eslint-disable-line
  )

export const useDocumentSnapData = <U, V = U>(
  snap: _web.DocumentSnapshot<U> | undefined,
  transformer?: (data: U, snap: _web.DocumentSnapshot<U>) => V,
): V | undefined =>
  useMemo(
    () => {
      if (!snap) {
        return undefined
      }
      const data = snap.data({ serverTimestamps: 'estimate' })
      if (!data) {
        return undefined
      }
      return transformer?.(data, snap) ?? ((data as unknown) as V)
    },
    [snap], // eslint-disable-line
  )
