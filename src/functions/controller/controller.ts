import { initFunctionRegisterer } from '../factories'
import { FunTypes } from '../FunTypes'

type Registerer = ReturnType<typeof initFunctionRegisterer>

type Registered<
  T extends keyof FunTypes.SchemaOptions & keyof Registerer
> = ReturnType<Registerer[T]>

type Runnables<
  CN extends FunTypes.NestedOptions,
  T extends keyof FunTypes.SchemaOptions & keyof Registerer
> = CN extends FunTypes.IO<any, any>
  ? Registered<T>
  : { [K in keyof CN]: Runnables<CN[K], T> }

type RegisteredRunnables<S extends FunTypes.SchemaOptions> = {
  [K in keyof S & keyof Registerer]: Runnables<S[K], K>
}

export const initFunctions = <S extends FunTypes.SchemaOptions>(
  schemaOptions: S,
  runnables: RegisteredRunnables<S>,
) => {
  return runnables
}
