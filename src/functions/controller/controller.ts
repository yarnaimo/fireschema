import { createFunctionFactory } from '../factories'
import { FunTypes } from '../FunTypes'

type GetCallableRunnables<
  CN extends FunTypes.Callable.NestedOptions
> = CN extends FunTypes.Callable.Options<any, any>
  ? ReturnType<ReturnType<typeof createFunctionFactory>['callable']>
  : {
      [K in keyof CN]: GetCallableRunnables<CN[K]>
    }

type GetFunctionRunnables<S extends FunTypes.SchemaOptions> = {
  callable: GetCallableRunnables<S['callable']>
}

export const initFunctions = <S extends FunTypes.SchemaOptions>(
  schemaOptions: S,
  runnables: GetFunctionRunnables<S>,
) => {
  return runnables
}
