import { t } from '../../lib/type'
import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

const callable = <I extends FunTypes.RecordBase, O extends FunTypes.RecordBase>(
  input: I,
  output: O,
): FunTypes.IO<I, O> => ({
  [$input]: input,
  [$output]: output,
})

const http = (): FunTypes.IO<FunTypes.RecordBase, FunTypes.RecordBase> => ({
  [$input]: t.Record({}),
  [$output]: t.Record({}),
})

const topic = <I extends FunTypes.RecordBase>(
  input: I,
): FunTypes.IO<I, FunTypes.RecordBase> => ({
  [$input]: input,
  [$output]: t.Record({}),
})

const schedule = (): FunTypes.IO<FunTypes.RecordBase, FunTypes.RecordBase> => ({
  [$input]: t.Record({}),
  [$output]: t.Record({}),
})

export const functionInterface = { callable, http, topic, schedule }

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
