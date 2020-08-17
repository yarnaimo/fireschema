import { Type } from '../../lib/type'
import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

export function $jsonSchema<T>(): FunTypes.JsonSchema<T> {
  throw new Error(
    'jsonSchema call expression not transformed and directly called',
  )
}

const EmptyObjectRuntype = $jsonSchema<{}>()

const callable = <I extends Type.JsonObject, O extends Type.JsonObject>(
  input: FunTypes.JsonSchema<I>,
  output: FunTypes.JsonSchema<O>,
): FunTypes.IO<I, O> => ({
  [$input]: input,
  [$output]: output,
})

const http = (): FunTypes.IO<{}, {}> => ({
  [$input]: EmptyObjectRuntype,
  [$output]: EmptyObjectRuntype,
})

const topic = <I>(input: FunTypes.JsonSchema<I>): FunTypes.IO<I, {}> => ({
  [$input]: input,
  [$output]: EmptyObjectRuntype,
})

const schedule = (): FunTypes.IO<{}, {}> => ({
  [$input]: EmptyObjectRuntype,
  [$output]: EmptyObjectRuntype,
})

export const functionInterface = { callable, http, topic, schedule }

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
