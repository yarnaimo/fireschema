import { STypes } from '../../firestore'
import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

const callable = <I, O>(
  input: STypes.DataSchemaOptions<I>,
  output: STypes.DataSchemaOptions<O>,
): FunTypes.IO<I, O> => ({
  [$input]: input,
  [$output]: output,
})

const http = (): FunTypes.IO<{}, {}> => ({
  [$input]: {},
  [$output]: {},
})

const topic = <I>(input: STypes.DataSchemaOptions<I>): FunTypes.IO<I, {}> => ({
  [$input]: input,
  [$output]: {},
})

const schedule = (): FunTypes.IO<{}, {}> => ({
  [$input]: {},
  [$output]: {},
})

export const functionInterface = { callable, http, topic, schedule }

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
