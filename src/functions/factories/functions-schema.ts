import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

export const callableSchema = <
  I extends FunTypes.RecordBase,
  O extends FunTypes.RecordBase
>(
  input: I,
  output: O,
): FunTypes.CallableOption<I, O> => ({
  [$input]: input,
  [$output]: output,
})

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
