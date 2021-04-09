import { IResult, Result } from 'lifts'
import { _fweb } from '../../../lib/functions-types'
import { $input, $output } from '../../constants'
import { FunTypes } from '../../types'
import { ExtractFunctionPaths, ParseFunctionPath } from '../../types/_functions'
import { GetDeep } from '../../types/_object'

export class TypedCaller<M extends FunTypes.FunctionsModule> {
  constructor(readonly functionsApp: _fweb.Functions) {}

  async call<
    FP extends ExtractFunctionPaths<M['callable']>,
    L extends string[] = ParseFunctionPath<FP>,
    _C = GetDeep<M['callable'], L>,
    C extends FunTypes.Callable.EnsureMeta<_C> = FunTypes.Callable.EnsureMeta<_C>
  >(
    functionPath: FP,
    data: C[typeof $input],
    options?: _fweb.HttpsCallableOptions,
  ): Promise<IResult<C[typeof $output], _fweb.HttpsError>> {
    const name = ['callable', functionPath].join('-')
    const callable = this.functionsApp.httpsCallable(name, options)

    try {
      const result = await callable(data)
      return Result.ok(result.data as C[typeof $output])
    } catch (error) {
      return Result.err(error as _fweb.HttpsError)
    }
  }
}