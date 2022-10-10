'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.useFirestoreErrorLogger = exports.useSafeRef = void 0
const dayjs_1 = require('dayjs')
const firestore_1 = require('firebase/firestore')
const react_1 = require('react')
const queryOrRefEqual = (left, right) => {
  return left instanceof firestore_1.Query
    ? (0, firestore_1.queryEqual)(left, right)
    : (0, firestore_1.refEqual)(left, right)
}
const isEqual = (left, right) => {
  const bothNull = !left && !right
  const equal = !!left && !!right && queryOrRefEqual(left, right)
  return bothNull || equal
}
const useSafeRef = (ref) => {
  var _a, _b
  const timestampsRef = (0, react_1.useRef)([])
  const memoizedRef = (0, react_1.useRef)()
  const refChanged = !isEqual(memoizedRef.current, ref)
  if (refChanged) {
    memoizedRef.current = ref
    timestampsRef.current = [(0, dayjs_1.default)(), ...timestampsRef.current]
  }
  const exceeded = (0, react_1.useRef)(false)
  const a = !!((_a = timestampsRef.current[3]) === null || _a === void 0
    ? void 0
    : _a.isAfter((0, dayjs_1.default)().subtract(3, 'second')))
  const b = !!((_b = timestampsRef.current[5]) === null || _b === void 0
    ? void 0
    : _b.isAfter((0, dayjs_1.default)().subtract(5, 'second')))
  exceeded.current || (exceeded.current = a || b)
  const safeRef = exceeded.current ? undefined : memoizedRef.current
  if (!safeRef) {
    console.error(
      '%cRef change limit exceeded!!!',
      'font-weight: bold; font-size: large; color: red;',
    )
    throw new Promise(() => {})
  }
  return { safeRef, refChanged, timestamps: timestampsRef }
}
exports.useSafeRef = useSafeRef
const useFirestoreErrorLogger = (error) => {
  ;(0, react_1.useEffect)(() => {
    if (error) {
      console.error(error)
    }
  }, [error])
}
exports.useFirestoreErrorLogger = useFirestoreErrorLogger
