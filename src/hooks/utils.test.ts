import { renderHook } from '@testing-library/react-hooks'
import dayjs from 'dayjs'
import { authedApp } from '../__tests__/_infrastructure/_app'
import { sleep } from '../__tests__/_utils/common'
import { useRefChangeLimitExceeded } from './utils'

const logTimestamps = (timestamps: dayjs.Dayjs[]) => {
  console.log(
    timestamps.map((a) => a.toISOString()),
    dayjs().toISOString(),
  )
}

const app = authedApp('user').firestore()
const posts = app.collection('posts')

test('exceeded', async () => {
  const { result, rerender, unmount } = renderHook(() => {
    const date = dayjs().toDate()
    return useRefChangeLimitExceeded(posts.where('date', '==', date))
  })

  rerender()
  await sleep(500)
  rerender()
  await sleep(500)
  rerender()
  await sleep(500)

  expect(result.current.timestamps.current.length).toBeGreaterThan(1)
  expect(result.current.exceeded()).toBe(true)
  expect(result.current.safeRef()).toBeFalsy()

  await sleep(5100)

  // logTimestamps(result.current.timestamps.current)

  expect(result.current.timestamps.current.length).toBeGreaterThan(1)
  expect(result.current.exceeded()).toBe(false)
  expect(result.current.safeRef()).toBeTruthy()

  unmount()
})

test('not exceeded', async () => {
  const date = dayjs().toDate()

  const { result, rerender, unmount } = renderHook(() => {
    return useRefChangeLimitExceeded(posts.where('date', '==', date))
  })

  rerender()
  await sleep(500)

  expect(result.current.timestamps.current.length).toBe(1)
  expect(result.current.exceeded()).toBe(false)
  expect(result.current.safeRef()).toBeTruthy()

  await sleep(5100)

  expect(result.current.timestamps.current.length).toBe(1)
  expect(result.current.exceeded()).toBe(false)
  expect(result.current.safeRef()).toBeTruthy()

  unmount()
})
