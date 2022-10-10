import { useMemo, useRef } from 'react'
import { useFirestoreCollection } from 'reactfire'
import { useQuerySnapData } from './useSnapData.js'
import { useFirestoreErrorLogger, useSafeRef } from './utils.js'
export const useTypedCollection = (
  typedRef,
  { suspense = true, ...dataOptions } = {},
) => {
  const { safeRef: safeQuery, refChanged } = useSafeRef(typedRef.raw)
  const memoizedTypedRef = useRef()
  if (refChanged) {
    memoizedTypedRef.current = typedRef
  }
  const { data: _snap, error } = useFirestoreCollection(safeQuery, { suspense })
  useFirestoreErrorLogger(error)
  const { snap, data } = useQuerySnapData(typedRef, _snap, dataOptions)
  return useMemo(() => {
    refChanged
    return { ref: memoizedTypedRef.current, snap, data, error }
  }, [data, error, refChanged, snap])
}
