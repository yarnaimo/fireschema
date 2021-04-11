import { firestore } from '@firebase/rules-unit-testing'

type Ref = { isEqual(a: any): boolean }

export const expectEqualRef = (a: Ref, b: Ref, expected = true) =>
  expect(a.isEqual(b)).toBe(expected)

export const expectAnyTimestamp = () => expect.any(firestore.Timestamp)
