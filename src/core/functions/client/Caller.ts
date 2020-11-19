import { IResult, Result } from 'lifts'
import { $input, $output } from '../../constants'
import { FunTypes } from '../../types'
import { ExtractFunctionPaths, ParseFunctionPath } from '../../types/_functions'
import { GetDeep } from '../../types/_object'

export const Caller = <M extends FunTypes.FunctionsModule>(
  functionsApp: firebase.functions.Functions,
) => {
  const call = async <
    FP extends ExtractFunctionPaths<M['callable']>,
    L extends string[] = ParseFunctionPath<FP>,
    _C = GetDeep<M['callable'], L>,
    C extends FunTypes.Callable.EnsureMeta<_C> = FunTypes.Callable.EnsureMeta<
      _C
    >
  >(
    functionPath: FP,
    data: C[typeof $input],
    options?: firebase.functions.HttpsCallableOptions,
  ): Promise<IResult<C[typeof $output], firebase.functions.HttpsError>> => {
    const name = ['callable', functionPath].join('-')
    const callable = functionsApp.httpsCallable(name, options)

    try {
      const result = await callable(data)
      return Result.ok(result.data as C[typeof $output])
    } catch (error) {
      return Result.err(error as firebase.functions.HttpsError)
    }
  }

  return call
}
