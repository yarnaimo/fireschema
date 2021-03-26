export const parseFunctionPath = (path: string) => path.split('-')

export const isOtherEventTrigger = () =>
  !!process.env.FUNCTION_NAME &&
  process.env.FUNCTION_TRIGGER_TYPE === 'OTHER_EVENT_TRIGGER'
