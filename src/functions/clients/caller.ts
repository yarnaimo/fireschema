import { IResult, Result } from 'lifts'
import { GetDeep, Loc } from '../../types/_object'
import { FunTypes } from '../FunTypes'

export const initCaller = <S extends FunTypes.SchemaOptions>(
  functionsApp: firebase.functions.Functions,
  schemaOptions: S,
) => {
  const call = async <
    L extends Loc<S['callable']>,
    _C = GetDeep<S['callable'], L>,
    C extends FunTypes.EnsureIO<_C> = FunTypes.EnsureIO<_C>
  >(
    loc: L,
    data: FunTypes.InputType<C>,
    options?: firebase.functions.HttpsCallableOptions,
  ): Promise<
    IResult<FunTypes.OutputType<C>, firebase.functions.HttpsError>
  > => {
    const name = ['callable', ...loc].join('-')
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
