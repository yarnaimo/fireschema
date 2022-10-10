'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.useTypedCollection = void 0
const react_1 = require('react')
const reactfire_1 = require('reactfire')
const useSnapData_js_1 = require('./useSnapData.js')
const utils_js_1 = require('./utils.js')
const useTypedCollection = (
  typedRef,
  { suspense = true, ...dataOptions } = {},
) => {
  const { safeRef: safeQuery, refChanged } = (0, utils_js_1.useSafeRef)(
    typedRef.raw,
  )
  const memoizedTypedRef = (0, react_1.useRef)()
  if (refChanged) {
    memoizedTypedRef.current = typedRef
  }
  const { data: _snap, error } = (0, reactfire_1.useFirestoreCollection)(
    safeQuery,
    { suspense },
  )
  ;(0, utils_js_1.useFirestoreErrorLogger)(error)
  const { snap, data } = (0, useSnapData_js_1.useQuerySnapData)(
    typedRef,
    _snap,
    dataOptions,
  )
  return (0, react_1.useMemo)(() => {
    refChanged
    return { ref: memoizedTypedRef.current, snap, data, error }
  }, [data, error, refChanged, snap])
}
exports.useTypedCollection = useTypedCollection
