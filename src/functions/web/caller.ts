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
    _Options = GetDeep<S['callable'], L>,
    Options extends FunTypes.EnsureCallaleOptions<
      _Options
    > = FunTypes.EnsureCallaleOptions<_Options>
  >(
    loc: L,
    data: FunTypes.InputType<Options>,
    options?: firebase.functions.HttpsCallableOptions,
  ): Promise<
    IResult<Options[typeof $output], firebase.functions.HttpsError>
  > => {
    const name = [prefix, 'callable', ...loc].join('-')
    const callable = functionsApp.httpsCallable(name, options)

    try {
      const result = await callable(data)
      return Result.ok(result.data as FunTypes.OutputType<Options>)
    } catch (error) {
      return Result.err(error as firebase.functions.HttpsError)
    }
  }

  return call
}
