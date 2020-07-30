import dayjs, { Dayjs } from 'dayjs'
import { firestore } from 'firebase/app'
import { useEffect, useRef } from 'react'
import { HasIsEqual } from 'react-firebase-hooks/firestore/dist/util'

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

const isEqual = <T extends HasIsEqual<T>>(
  v1: T | null | undefined,
  v2: T | null | undefined,
): boolean => {
  const bothNull: boolean = !v1 && !v2
  const equal: boolean = !!v1 && !!v2 && v1.isEqual(v2)
  console.log(bothNull, equal)

  return bothNull || equal
}

// export const useIsEqualRef = <T extends HasIsEqual<T>>(
//   value: T | null | undefined,
//   onChange?: () => void,
// ): RefHook<T | null | undefined> => {
//   return useComparatorRef(value, isEqual, onChange)
// }

export type UseTDocument<T> = {
  data: T | undefined
  snap: firestore.DocumentSnapshot<T> | undefined
  loading: boolean
  error: Error | undefined
}

export const useRefChangeLimitExceeded = (
  fref: HasIsEqual<any> | null | undefined,
) => {
  const timestampsRef = useRef<Dayjs[]>([])

  const frefRef = useRef<HasIsEqual<any> | null | undefined>(null)
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

  if (exceeded()) {
    console.error(
      '%cRef change limit exceeded!!!',
      'font-weight: bold; font-size: large; color: red;',
    )
  }

  return { exceeded, timestamps: timestampsRef }
}
