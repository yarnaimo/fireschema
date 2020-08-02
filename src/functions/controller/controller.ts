import { createFunctionFactory } from '../factories'
import { FunTypes } from '../FunTypes'

type GetCallableRunnables<
  Options extends FunTypes.NestedCallableOptions
> = Options extends FunTypes.CallableOption<any, any>
  ? ReturnType<ReturnType<typeof createFunctionFactory>['callable']>
  : {
      [K in keyof Options]: GetCallableRunnables<Options[K]>
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
