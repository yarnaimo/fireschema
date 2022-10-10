'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.useQuerySnapData = exports.useDocumentSnapData = void 0
const react_1 = require('react')
const index_js_1 = require('../core/index.js')
const useDocumentSnapData = (
  typedDoc,
  _snap,
  { transformer, snapshotOptions } = {},
) => {
  const snap = (0, react_1.useMemo)(
    () => new index_js_1.TypedDocumentSnap(typedDoc.options, _snap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_snap],
  )
  const data = (0, react_1.useMemo)(
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
exports.useDocumentSnapData = useDocumentSnapData
const useQuerySnapData = (
  typedQuery,
  _snap,
  { transformer, snapshotOptions },
) => {
  const snap = (0, react_1.useMemo)(
    () => new index_js_1.TypedQuerySnap(typedQuery.options, _snap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_snap],
  )
  const data = (0, react_1.useMemo)(
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
exports.useQuerySnapData = useQuerySnapData
