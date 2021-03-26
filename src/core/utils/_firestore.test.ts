import { firestore } from 'firebase-admin'
import { _lastUpdateByTrigger } from '../constants'
import { lastUpdatedByTrigger } from './_firestore'

describe('lastUpdatedByTrigger', () => {
  test.each([
    [undefined, undefined, false],
    [
      firestore.Timestamp.fromDate(new Date('2021-03-26T15:00:00Z')),
      undefined,
      false,
    ],
    [
      undefined,
      firestore.Timestamp.fromDate(new Date('2021-03-26T15:00:00Z')),
      true,
    ],
    [
      firestore.Timestamp.fromDate(new Date('2021-03-26T14:59:00Z')),
      firestore.Timestamp.fromDate(new Date('2021-03-26T15:00:00Z')),
      true,
    ],
    [
      firestore.Timestamp.fromDate(new Date('2021-03-26T15:00:00Z')),
      firestore.Timestamp.fromDate(new Date('2021-03-26T15:00:00Z')),
      false,
    ],
  ])('%s, %s', (beforeTs, afterTs, expected) => {
    expect(
      lastUpdatedByTrigger(
        { [_lastUpdateByTrigger]: beforeTs },
        { [_lastUpdateByTrigger]: afterTs },
      ),
    ).toBe(expected)
  })
})
