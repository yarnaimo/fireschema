import dayjs, { Dayjs } from 'dayjs'
import {
  CollectionReference,
  DocumentReference,
  Query,
  queryEqual,
  refEqual,
} from 'firebase/firestore'
import { useEffect, useRef } from 'react'
import { _web } from '../lib/firestore-types'

export type HasGetOptions = {
  // TODO:
  getOptions?: unknown
}

export type HasSnapListenOptions = {
  snapshotListenOptions?: _web.SnapshotListenOptions
}

type RefHook<T> = {
  current: T
}

// export const useComparatorRef = <T>(
//   value: T | null | undefined,
//   isEqual: (v1: T | null | undefined, v2: T | null | undefined) => boolean,
//   onChange?: () => void,
// ): RefHook<T | null | undefined> => {
//   const ref = useRef(value)
//   useEffect(() => {
//     if (!isEqual(value, ref.current)) {
//       ref.current = value
//       if (onChange) {
//         onChange()
//       }
//     }
//   })
//   return ref
// }

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

// export const useIsEqualRef = <T extends HasIsEqual<T>>(
//   value: T | null | undefined,
//   onChange?: () => void,
// ): RefHook<T | null | undefined> => {
//   return useComparatorRef(value, isEqual, onChange)
// }

export const useRefChangeLimitExceeded = <T extends RefOrQuery>(
  fref: T | null | undefined,
) => {
  const timestampsRef = useRef<Dayjs[]>([])

  const frefRef = useRef<RefOrQuery | null | undefined>(null)
  useEffect(() => {
    if (!isEqual(fref, frefRef.current)) {
      frefRef.current = fref
      timestampsRef.current = [dayjs(), ...timestampsRef.current]
    }
  })

  const exceeded = () => {
    const a = !!timestampsRef.current[3]?.isAfter(dayjs().subtract(3, 'second'))
    const b = !!timestampsRef.current[5]?.isAfter(dayjs().subtract(5, 'second'))
    return a || b
  }

  const safeRef = () => (exceeded() ? undefined : fref)

  if (exceeded()) {
    console.error(
      '%cRef change limit exceeded!!!',
      'font-weight: bold; font-size: large; color: red;',
    )
  }

  return { exceeded, safeRef, timestamps: timestampsRef }
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
