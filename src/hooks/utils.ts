import dayjs, { Dayjs } from 'dayjs'
import {
  CollectionReference,
  DocumentReference,
  Query,
  queryEqual,
  refEqual,
} from 'firebase/firestore'
import { useEffect, useRef } from 'react'

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

export const useSafeRef = <T extends RefOrQuery>(ref: T) => {
  const timestampsRef = useRef<Dayjs[]>([])

  const prevRef = useRef<RefOrQuery>()
  const refChanged = !isEqual(prevRef.current, ref)
  prevRef.current = ref

  if (refChanged) {
    timestampsRef.current = [dayjs(), ...timestampsRef.current]
  }

  const exceeded = useRef(false)
  const a = !!timestampsRef.current[3]?.isAfter(dayjs().subtract(3, 'second'))
  const b = !!timestampsRef.current[5]?.isAfter(dayjs().subtract(5, 'second'))
  exceeded.current ||= a || b

  const safeRef = exceeded.current ? undefined : ref

  if (!safeRef) {
    console.error(
      '%cRef change limit exceeded!!!',
      'font-weight: bold; font-size: large; color: red;',
    )
    throw new Promise(() => {})
  }

  return { safeRef, refChanged, timestamps: timestampsRef }
}

export const useFirestoreErrorLogger = (error: Error | undefined) => {
  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])
}
