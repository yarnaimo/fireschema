import { IResult, Result } from 'lifts'
import { GetDeep, Loc } from '../../types/_object'
import { $output } from '../constants'
import { FunTypes } from '../FunTypes'

export const initCaller = <S extends FunTypes.SchemaOptions>(
  functionsApp: firebase.functions.Functions,
  schemaOptions: S,
  prefix: string,
) => {
  const call = async <
    L extends Loc<S['callable']>,
    _C = GetDeep<S['callable'], L>,
    C extends FunTypes.Callable.EnsureOption<
      _C
    > = FunTypes.Callable.EnsureOption<_C>
  >(
    loc: L,
    data: FunTypes.Callable.InputType<C>,
    options?: firebase.functions.HttpsCallableOptions,
  ): Promise<IResult<C[typeof $output], firebase.functions.HttpsError>> => {
    const name = [prefix, 'callable', ...loc].join('-')
    const callable = functionsApp.httpsCallable(name, options)

    try {
      const result = await callable(data)
      return Result.ok(result.data as FunTypes.Callable.OutputType<C>)
    } catch (error) {
      return Result.err(error as firebase.functions.HttpsError)
    }
  }

  return call
}
