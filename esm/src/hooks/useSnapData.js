import { useMemo } from 'react'
import { TypedDocumentSnap, TypedQuerySnap } from '../core/index.js'
export const useDocumentSnapData = (
  typedDoc,
  _snap,
  { transformer, snapshotOptions } = {},
) => {
  const snap = useMemo(
    () => new TypedDocumentSnap(typedDoc.options, _snap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_snap],
  )
  const data = useMemo(
    () =>
      snap.data({
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
export const useQuerySnapData = (
  typedQuery,
  _snap,
  { transformer, snapshotOptions },
) => {
  const snap = useMemo(
    () => new TypedQuerySnap(typedQuery.options, _snap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_snap],
  )
  const data = useMemo(
    () =>
      snap.docs.map((docSnap) =>
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
