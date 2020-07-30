type Ref = { isEqual(a: any): boolean }

export const expectEqualRef = (a: Ref, b: Ref) =>
  expect(a.isEqual(b)).toBeTruthy()
