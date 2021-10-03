import { useMemo } from 'react'

import {
  DocumentSnapDataOptions,
  QueryDocumentSnapDataOptions,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
  TypedQueryRef,
  TypedQuerySnap,
} from '../core/index.js'
import { _web } from '../lib/firestore-types'

export const useDocumentSnapData = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedDoc: TypedDocumentRef<S, _web.Firestore, L, U> | null | undefined,
  _snap: _web.DocumentSnapshot<U> | undefined,
  {
    transformer,
    snapshotOptions,
  }: DocumentSnapDataOptions<S, _web.Firestore, L, U, V> = {},
) => {
  const snap = useMemo(
    () =>
      typedDoc && _snap
        ? new TypedDocumentSnap(typedDoc.options, _snap)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_snap],
  )

  const data = useMemo(
    () =>
      snap?.data({
        transformer,
        snapshotOptions: {
          serverTimestamps: 'estimate',
          ...snapshotOptions,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snap],
  )

  return { snap, data }
}

export const useQuerySnapData = <
  S extends STypes.RootOptions.All,
  L extends string,
  U,
  V = U,
>(
  typedQuery: TypedQueryRef<S, _web.Firestore, L, U> | null | undefined,
  _snap: _web.QuerySnapshot<U> | undefined,
  {
    transformer,
    snapshotOptions,
  }: QueryDocumentSnapDataOptions<S, _web.Firestore, L, U, V>,
) => {
  const snap = useMemo(
    () =>
      typedQuery && _snap
        ? new TypedQuerySnap(typedQuery.options, _snap)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_snap],
  )

  const data = useMemo(
    () =>
      snap?.typedDocs.map((docSnap) =>
        docSnap.data({
          transformer,
          snapshotOptions: {
            serverTimestamps: 'estimate',
            ...snapshotOptions,
          },
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snap],
  )

  return { snap, data }
}
