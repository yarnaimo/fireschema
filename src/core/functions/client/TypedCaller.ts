import { httpsCallable } from 'firebase/functions'

import { FunctionsErrorFixed, _fweb } from '../../../lib/functions-types.js'
import { is } from '../../../lib/type.js'
import { ExtractFP } from '../../types/_functions.js'
import { FunTypes } from '../../types/index.js'

const encode = (data: any): any => {
  return Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      if (value === undefined) {
        return []
      }
      if (!is.array(value) && is.object(value)) {
        return [[key, encode(value)]]
      }
      return [[key, value]]
    }),
  )
}

export class TypedCaller<M extends FunTypes.FunctionsModule> {
  constructor(readonly functionsApp: _fweb.Functions) {}

  async call<MC extends M['callable'], FP extends ExtractFP<MC>>(
    functionPath: FP,
    data: FunTypes.Callable.InputOf<MC, FP>,
    options?: _fweb.HttpsCallableOptions,
  ): Promise<FunTypes.Callable.CallResult<FunTypes.Callable.OutputOf<MC, FP>>> {
    const name = ['callable', functionPath].join('-')
    const callable = httpsCallable(this.functionsApp, name, options)

    try {
      const result = await callable(encode(data))
      return {
        data: result.data as FunTypes.Callable.OutputOf<MC, FP>,
      }
    } catch (error) {
      return { error: error as FunctionsErrorFixed }
    }
  }
}
