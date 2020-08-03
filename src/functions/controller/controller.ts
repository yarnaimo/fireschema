import { initFunctionRegisterer } from '../factories'
import { FunTypes } from '../FunTypes'

type GetCallableRunnables<
  CN extends FunTypes.NestedOptions
> = CN extends FunTypes.IO<any, any>
  ? ReturnType<ReturnType<typeof initFunctionRegisterer>['callable']>
  : {
      [K in keyof CN]: GetCallableRunnables<CN[K]>
    }

type GetTopicRunnables<
  CN extends FunTypes.NestedOptions
> = CN extends FunTypes.IO<any, any>
  ? ReturnType<ReturnType<typeof initFunctionRegisterer>['topic']>
  : {
      [K in keyof CN]: GetTopicRunnables<CN[K]>
    }

type GetFunctionRunnables<S extends FunTypes.SchemaOptions> = {
  callable: GetCallableRunnables<S['callable']>
  topic: GetTopicRunnables<S['topic']>
}

export const initFunctions = <S extends FunTypes.SchemaOptions>(
  schemaOptions: S,
  runnables: GetFunctionRunnables<S>,
) => {
  return runnables
}
