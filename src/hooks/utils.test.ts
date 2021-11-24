import { renderHook } from '@testing-library/react-hooks'
import dayjs from 'dayjs'
import { collection, query, where } from 'firebase/firestore'

import { getTestAppWeb } from '../__tests__/_infrastructure/_app.js'
import { sleep } from '../__tests__/_utils/common.js'
import { useSafeRef } from './utils.js'

const logTimestamps = (timestamps: dayjs.Dayjs[]) => {
  console.log(
    timestamps.map((a) => a.toISOString()),
    dayjs().toISOString(),
  )
}

const app = getTestAppWeb('user').firestore()
const posts = collection(app, 'posts')

describe('useSafeRef', () => {
  test('exceeded', async () => {
    const { result, rerender, unmount } = renderHook(() => {
      const consoleMock = jest.spyOn(console, 'error').mockImplementation()

      const date = dayjs().toDate()
      const result = useSafeRef(query(posts, where('date', '==', date)))

      consoleMock.mockRestore()
      return result
    })
    expect(result.current.refChanged).toBe(true)

    rerender()
    expect(result.current.refChanged).toBe(true)
    await sleep(250)
    rerender()
    await sleep(250)
    rerender()
    await sleep(250)

    rerender()
    expect(result.current.refChanged).toBe(true)
    expect(result.current.timestamps.current.length).toBeGreaterThan(1)
    expect(result.current.safeRef).toBeFalsy()

    await sleep(5100)

    // logTimestamps(result.current.timestamps.current)

    rerender()
    expect(result.current.refChanged).toBe(true)
    expect(result.current.timestamps.current.length).toBeGreaterThan(1)
    expect(result.current.safeRef).toBeTruthy()

    unmount()
  })

  test('not exceeded', async () => {
    const date = dayjs().toDate()

    const { result, rerender, unmount } = renderHook(() => {
      return useSafeRef(query(posts, where('date', '==', date)))
    })
    expect(result.current.refChanged).toBe(true)

    rerender()
    expect(result.current.refChanged).toBe(false)
    await sleep(500)

    rerender()
    expect(result.current.refChanged).toBe(false)
    expect(result.current.timestamps.current.length).toBe(1)
    expect(result.current.safeRef).toBeTruthy()

    await sleep(5100)

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
