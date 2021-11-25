export const wrapSuspendable = <T>(fn: () => T) => {
  let result: T | null
  try {
    result = fn()
  } catch (error) {
    if (error instanceof Promise) {
      result = null
    } else {
      throw error
    }
  }
  return result
}
