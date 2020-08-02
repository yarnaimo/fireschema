import { useEffect, useMemo } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { fweb } from '../../types/_firestore'
import { useRefChangeLimitExceeded } from './utils'

export const useTypedDocument = <T>(
  docRef: fweb.DocumentReference<T> | null | undefined,
  options?: {
    snapshotListenOptions?: fweb.SnapshotListenOptions
  },
) => {
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

  const data = useMemo(() => snap?.data() as T | undefined, [snap])

  return {
    data,
    snap: snap as fweb.DocumentSnapshot<T> | undefined,
    loading,
    error,
  }
}

export const useTypedQuery = <T>(
  query: fweb.Query<T> | null | undefined,
  options?: {
    snapshotListenOptions?: fweb.SnapshotListenOptions
  },
) => {
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

  const data = useMemo(() => snap?.docs.map((doc) => doc.data() as T), [snap])

  return {
    data,
    snap: snap as fweb.QuerySnapshot<T> | undefined,
    loading,
    error,
  }
}
