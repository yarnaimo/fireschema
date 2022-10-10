'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const react_hooks_1 = require('@testing-library/react-hooks')
const dayjs_1 = require('dayjs')
const firestore_1 = require('firebase/firestore')
const app_js_1 = require('../__tests__/_services/app.js')
const common_js_1 = require('../__tests__/_utils/common.js')
const hooks_js_1 = require('../__tests__/_utils/hooks.js')
const utils_js_1 = require('./utils.js')
const logTimestamps = (timestamps) => {
  console.log(
    timestamps.map((a) => a.toISOString()),
    (0, dayjs_1.default)().toISOString(),
  )
}
const app = (0, app_js_1.getTestAppWeb)('user').firestore()
const posts = (0, firestore_1.collection)(app, 'posts')
describe('useSafeRef', () => {
  test('exceeded', async () => {
    const { result, rerender, unmount } = (0, react_hooks_1.renderHook)(() => {
      const consoleMock = jest.spyOn(console, 'error').mockImplementation()
      const date = (0, dayjs_1.default)().toDate()
      const result = (0, hooks_js_1.wrapSuspendable)(() =>
        (0, utils_js_1.useSafeRef)(
          (0, firestore_1.query)(
            posts,
            (0, firestore_1.where)('date', '==', date),
          ),
        ),
      )
      consoleMock.mockRestore()
      return result
    })
    expect(result.current.refChanged).toBe(true)
    rerender()
    expect(result.current.refChanged).toBe(true)
    await (0, common_js_1.sleep)(250)
    rerender()
    await (0, common_js_1.sleep)(250)
    rerender()
    await (0, common_js_1.sleep)(250)
    rerender()
    expect(result.current).toBe(null)
    await (0, common_js_1.sleep)(5100)
    // logTimestamps(result.current.timestamps.current)
    rerender()
    expect(result.current).toBe(null)
    unmount()
  })
  test('not exceeded', async () => {
    const date = (0, dayjs_1.default)().toDate()
    const { result, rerender, unmount } = (0, react_hooks_1.renderHook)(() => {
      return (0, utils_js_1.useSafeRef)(
        (0, firestore_1.query)(
          posts,
          (0, firestore_1.where)('date', '==', date),
        ),
      )
    })
    expect(result.current.refChanged).toBe(true)
    rerender()
    expect(result.current.refChanged).toBe(false)
    await (0, common_js_1.sleep)(500)
    rerender()
    expect(result.current.refChanged).toBe(false)
    expect(result.current.timestamps.current.length).toBe(1)
    expect(result.current.safeRef).toBeTruthy()
    await (0, common_js_1.sleep)(5100)
    rerender()
    expect(result.current.refChanged).toBe(false)
    expect(result.current.timestamps.current.length).toBe(1)
    expect(result.current.safeRef).toBeTruthy()
    unmount()
  })
})
// test('useLoadingOverride', () => {
//   const q = (tag: string) => query(posts, where('tag', '==', tag))
//   let args: [Query | undefined, boolean] = [undefined, true]
//   const update = (..._args: [Query | undefined, boolean]) => {
//     args = _args
//     rerender()
//   }
//   const { result, rerender, unmount } = renderHook(() =>
//     useLoadingOverride(useSafeRef(args[0]).safeRef, args[1]),
//   )
//   expect(result.current).toBeTruthy()
//   update(undefined, false)
//   expect(result.current).toBeFalsy()
//   update(q('tag1'), false)
//   expect(result.current).toBeTruthy() // ref changed
//   update(q('tag1'), true)
//   expect(result.current).toBeTruthy()
//   update(q('tag1'), false)
//   expect(result.current).toBeFalsy()
//   unmount()
// })
