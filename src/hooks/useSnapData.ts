import { useMemo } from 'react'
import { _web } from '../lib/firestore-types'

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
    [querySnap],
  )

export const useDocumentSnapData = <U, V = U>(
  snap: _web.DocumentSnapshot<U> | undefined,
  transformer?: (data: U, snap: _web.DocumentSnapshot<U>) => V,
): V | undefined =>
  useMemo(() => {
    if (!snap) {
      return undefined
    }
    const data = snap.data({ serverTimestamps: 'estimate' })
    if (!data) {
      return undefined
    }
    return transformer?.(data, snap) ?? ((data as unknown) as V)
  }, [snap])
