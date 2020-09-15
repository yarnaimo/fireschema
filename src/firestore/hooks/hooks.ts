import { useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { fweb } from '../../types/_firestore'
import { useRefChangeLimitExceeded } from './utils'

export type UseTypedDocument<T> = {
  snap: fweb.DocumentSnapshot<T> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedDocument = <T>(
  docRef: fweb.DocumentReference<T> | null | undefined,
  options?: {
    snapshotListenOptions?: fweb.SnapshotListenOptions
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
    snap: snap as fweb.DocumentSnapshot<T> | undefined,
    loading,
    error,
  }
}

export type UseTypedQuery<T> = {
  snap: fweb.QuerySnapshot<T> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedQuery = <T>(
  query: fweb.Query<T> | null | undefined,
  options?: {
    snapshotListenOptions?: fweb.SnapshotListenOptions
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
    snap: snap as fweb.QuerySnapshot<T> | undefined,
    loading,
    error,
  }
}
