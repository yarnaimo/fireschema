import { renderHook } from '@testing-library/react-hooks'
import dayjs from 'dayjs'
import { useRefChangeLimitExceeded } from '../../hooks/utils'
import { store } from '../_infrastructure/store'

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const logTimestamps = (timestamps: dayjs.Dayjs[]) => {
  console.log(
    timestamps.map((a) => a.toISOString()),
    dayjs().toISOString(),
  )
}

const posts = store.app.collection('posts')

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

  await sleep(5100)

  // logTimestamps(result.current.timestamps.current)

  expect(result.current.timestamps.current.length).toBeGreaterThan(1)
  expect(result.current.exceeded()).toBe(false)

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

  await sleep(5100)

  expect(result.current.timestamps.current.length).toBe(1)
  expect(result.current.exceeded()).toBe(false)

  unmount()
})
