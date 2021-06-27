import { useMemo } from 'react'
import {
  DocumentSnapDataOptions,
  QueryDocumentSnapDataOptions,
  STypes,
  TypedDocumentSnap,
  TypedQuerySnap,
} from '../core'
import { _web } from '../lib/firestore-types'

export const useQuerySnapData = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  querySnap: TypedQuerySnap<S, _web.Firestore, L, U> | undefined,
  {
    transformer,
    snapshotOptions,
  }: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V>,
): V[] | undefined =>
  useMemo(
    () =>
      querySnap?.typedDocs.map((snap) =>
        snap.data({
          transformer,
          snapshotOptions: {
            serverTimestamps: 'estimate',
            ...snapshotOptions,
          },
        }),
      ),
    [querySnap],
  )

export const useDocumentSnapData = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  snap: TypedDocumentSnap<S, _web.Firestore, L, U> | undefined,
  {
    transformer,
    snapshotOptions,
  }: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
): V | undefined =>
  useMemo(
    () =>
      snap?.data({
        transformer,
        snapshotOptions: {
          serverTimestamps: 'estimate',
          ...snapshotOptions,
        },
      }),
    [snap],
  )
