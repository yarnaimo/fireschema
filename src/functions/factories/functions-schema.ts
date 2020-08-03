import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

const callable = <I extends FunTypes.RecordBase, O extends FunTypes.RecordBase>(
  input: I,
  output: O,
): FunTypes.IO<I, O> => ({
  [$input]: input,
  [$output]: output,
})

const topic = <I extends FunTypes.RecordBase>(
  input: I,
): FunTypes.IO<I, {}> => ({
  [$input]: input,
  [$output]: {},
})

const schedule = (): FunTypes.IO<{}, {}> => ({
  [$input]: {},
  [$output]: {},
})

export const functionInterface = { callable, topic, schedule }

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
