declare namespace NodeJS {
  interface ProcessEnv {
    readonly FUNCTION_NAME: string | undefined
    readonly FUNCTION_TRIGGER_TYPE: 'OTHER_EVENT_TRIGGER' | undefined
  }
}
