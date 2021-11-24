import dayjs, { Dayjs } from 'dayjs'
import {
  CollectionReference,
  DocumentReference,
  Query,
  queryEqual,
  refEqual,
} from 'firebase/firestore'
import { useEffect, useRef } from 'react'

import { _web } from '../lib/firestore-types.js'

type RefOrQuery = DocumentReference | CollectionReference | Query

const queryOrRefEqual = <T extends RefOrQuery>(left: T, right: T) => {
  return left instanceof Query
    ? queryEqual(left, right as any)
    : refEqual(left, right as any)
}

const isEqual = <T extends RefOrQuery>(
  left: T | null | undefined,
  right: T | null | undefined,
): boolean => {
  const bothNull: boolean = !left && !right
  const equal: boolean = !!left && !!right && queryOrRefEqual(left, right)

  return bothNull || equal
}

export const useSafeRef = <T extends RefOrQuery>(ref: T | undefined) => {
  const timestampsRef = useRef<Dayjs[]>([])

  const prevRef = useRef<RefOrQuery>()
  const refChanged = !isEqual(prevRef.current, ref)
  prevRef.current = ref

  if (refChanged) {
    timestampsRef.current = [dayjs(), ...timestampsRef.current]
  }

  const a = !!timestampsRef.current[3]?.isAfter(dayjs().subtract(3, 'second'))
  const b = !!timestampsRef.current[5]?.isAfter(dayjs().subtract(5, 'second'))
  const exceeded = a || b

  const safeRef = exceeded ? undefined : ref

  if (exceeded) {
    console.error(
      '%cRef change limit exceeded!!!',
      'font-weight: bold; font-size: large; color: red;',
    )
  }

  return { safeRef, refChanged, timestamps: timestampsRef }
}

export const useFirestoreErrorLogger = (
  error: _web.FirestoreError | undefined,
) => {
  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])
}
