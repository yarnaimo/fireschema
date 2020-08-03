import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

export const callableSchema = <
  I extends FunTypes.RecordBase,
  O extends FunTypes.RecordBase
>(
  input: I,
  output: O,
): FunTypes.IO<I, O> => ({
  [$input]: input,
  [$output]: output,
})

export const topicSchema = <I extends FunTypes.RecordBase>(
  input: I,
): FunTypes.IO<I, {}> => ({
  [$input]: input,
  [$output]: {},
})

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
