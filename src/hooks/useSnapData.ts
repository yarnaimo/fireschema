import { useMemo } from 'react'
import {
  STypes,
  TypedDocumentSnap,
  TypedQueryDocumentSnap,
  TypedQuerySnap,
} from '../core'
import { _web } from '../lib/firestore-types'

export type QueryDocumentSnapTransformer<
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V,
> = (data: U, snap: TypedQueryDocumentSnap<S, _web.Firestore, L, U>) => V

export type DocumentSnapTransformer<
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V,
> = (data: U, snap: TypedDocumentSnap<S, _web.Firestore, L, U>) => V

export const useQuerySnapData = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  querySnap: TypedQuerySnap<S, _web.Firestore, L, U> | undefined,
  transformer?: QueryDocumentSnapTransformer<S, L, U, V>,
  snapshotOptions?: _web.SnapshotOptions,
): V[] | undefined =>
  useMemo(
    () =>
      querySnap?.typedDocs.map((snap) => {
        const data = snap.data({
          serverTimestamps: 'estimate',
          ...snapshotOptions,
        })
        return transformer?.(data, snap) ?? (data as unknown as V)
      }),
    [querySnap],
  )

export const useDocumentSnapData = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  snap: TypedDocumentSnap<S, _web.Firestore, L, U> | undefined,
  transformer?: DocumentSnapTransformer<S, L, U, V>,
  snapshotOptions?: _web.SnapshotOptions,
): V | undefined =>
  useMemo(() => {
    if (!snap) {
      return undefined
    }
    const data = snap.data({
      serverTimestamps: 'estimate',
      ...snapshotOptions,
    })
    if (!data) {
      return undefined
    }
    return transformer?.(data, snap) ?? (data as unknown as V)
  }, [snap])
