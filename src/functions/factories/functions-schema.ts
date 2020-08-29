import { is, Type } from '../../lib/type'
import { $input, $output } from '../constants'
import { FunTypes } from '../FunTypes'

export function $jsonSchema<T>(): FunTypes.JsonSchema<T> {
  return (null as unknown) as FunTypes.JsonSchema<T>
}

const EmptyObjectRuntype = $jsonSchema<{}>()

const withGuard = <T extends FunTypes.IO<any, any>>(options: T) => {
  if (is.null_(options[$input]) || is.null_(options[$output])) {
    throw new Error(
      'jsonSchema call expression not transformed and directly called',
    )
  }
  return options
}

const callable = <I extends Type.JsonObject, O extends Type.JsonObject>(
  input: FunTypes.JsonSchema<I>,
  output: FunTypes.JsonSchema<O>,
): FunTypes.IO<I, O> =>
  withGuard({
    [$input]: input,
    [$output]: output,
  })

const http = (): FunTypes.IO<{}, {}> =>
  withGuard({
    [$input]: EmptyObjectRuntype,
    [$output]: EmptyObjectRuntype,
  })

const topic = <I>(input: FunTypes.JsonSchema<I>): FunTypes.IO<I, {}> =>
  withGuard({
    [$input]: input,
    [$output]: EmptyObjectRuntype,
  })

const schedule = (): FunTypes.IO<{}, {}> =>
  withGuard({
    [$input]: EmptyObjectRuntype,
    [$output]: EmptyObjectRuntype,
  })

export const functionInterface = { callable, http, topic, schedule }

export const createFunctionsSchema = <S extends FunTypes.SchemaOptions>(
  options: S,
) => options
