type Ref = { isEqual(a: any): boolean }

export const expectEqualRef = (a: Ref, b: Ref, expected = true) =>
  expect(a.isEqual(b)).toBe(expected)
