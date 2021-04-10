import { _fweb } from '../../../lib/functions-types'
import { FunTypes } from '../../types'
import { ExtractFP } from '../../types/_functions'

export class TypedCaller<M extends FunTypes.FunctionsModule> {
  constructor(readonly functionsApp: _fweb.Functions) {}

  async call<MC extends M['callable'], FP extends ExtractFP<MC>>(
    functionPath: FP,
    data: FunTypes.Callable.InputOf<MC, FP>,
    options?: _fweb.HttpsCallableOptions,
  ): Promise<FunTypes.Callable.CallResult<FunTypes.Callable.OutputOf<MC, FP>>> {
    const name = ['callable', functionPath].join('-')
    const callable = this.functionsApp.httpsCallable(name, options)

    try {
      const result = await callable(data)
      return {
        data: result.data as FunTypes.Callable.OutputOf<MC, FP>,
      }
    } catch (error) {
      return { error: error as _fweb.HttpsError }
    }
  }
}
