import { FunctionRegisterer } from '../factories'
import { FunTypes } from '../FunTypes'

type Registerer = ReturnType<typeof FunctionRegisterer>

type Registered<
  T extends keyof FunTypes.SchemaOptions & keyof Registerer
> = ReturnType<Registerer[T]>

type Runnables<
  CN extends FunTypes.NestedOptions,
  T extends keyof FunTypes.SchemaOptions & keyof Registerer
> = CN extends FunTypes.IO<any, any>
  ? Registered<T>
  : { [K in keyof CN]: Runnables<CN[K], T> }

type RegisteredRunnables<
  S extends FunTypes.SchemaOptions,
  FT extends FunTypes.FirestoreTrigger.NestedOptions
> = {
  [K in keyof S & keyof Registerer]: Runnables<S[K], K>
} & {
  firestoreTrigger: FT
}

export const initFunctions = <
  S extends FunTypes.SchemaOptions,
  FT extends FunTypes.FirestoreTrigger.NestedOptions
>(
  schemaOptions: S,
  runnables: RegisteredRunnables<S, FT>,
) => {
  return runnables
}
