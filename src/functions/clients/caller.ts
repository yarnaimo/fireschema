import { IResult, Result } from 'lifts'
import { GetDeep } from '../../types/_object'
import { FunTypes } from '../FunTypes'
import { FunctionPath, ParseFunctionPath } from '../_types'

export const initCaller = <S extends FunTypes.SchemaOptions>(
  functionsApp: firebase.functions.Functions,
  schemaOptions: S,
) => {
  const call = async <
    FP extends FunctionPath<S['callable']>,
    L extends string[] = ParseFunctionPath<FP>,
    _C = GetDeep<S['callable'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    functionPath: FP,
    data: FunTypes.InputType<C>,
    options?: firebase.functions.HttpsCallableOptions,
  ): Promise<
    IResult<FunTypes.OutputType<C>, firebase.functions.HttpsError>
  > => {
    const name = ['callable', functionPath].join('-')
    const callable = functionsApp.httpsCallable(name, options)

    try {
      const result = await callable(data)
      return Result.ok(result.data as FunTypes.OutputType<C>)
    } catch (error) {
      return Result.err(error as firebase.functions.HttpsError)
    }
  }

  return call
}
