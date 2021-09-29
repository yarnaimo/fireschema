export const sleep = async (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))
