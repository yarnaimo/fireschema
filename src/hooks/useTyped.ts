import { useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { TypedDocumentRef, TypedQueryRef } from '../core'
import { _web } from '../lib/firestore-types'
import { useDocumentSnapData, useQuerySnapData } from './useSnapData'
import { useRefChangeLimitExceeded } from './utils'

export type UseTypedDocument<U, V = U> = {
  data: V | undefined
  snap: _web.DocumentSnapshot<U> | undefined
  loading: boolean
  error: Error | undefined
}

export const useTypedDocument = <U, V = U>(
  typedDoc: TypedDocumentRef<any, _web.Firestore, any, U> | null | undefined,
  transformer?: (data: U, snap: _web.DocumentSnapshot<U>) => V,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
  },
): UseTypedDocument<U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(typedDoc?.raw)

  const [snap, loading, error] = useDocument<U>(
    exceeded() ? undefined : typedDoc?.raw,
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
  typedQuery: TypedQueryRef<any, _web.Firestore, any, U> | null | undefined,
  transformer?: (data: U, snap: _web.DocumentSnapshot<U>) => V,
  options?: {
    snapshotListenOptions?: _web.SnapshotListenOptions
  },
): UseTypedQuery<U, V> => {
  const { exceeded } = useRefChangeLimitExceeded(typedQuery?.raw)

  const [snap, loading, error] = useCollection<U>(
    exceeded() ? undefined : typedQuery?.raw,
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
