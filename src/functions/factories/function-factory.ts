import type { FunctionBuilder, https } from 'firebase-functions'
import { FunTypes } from '..'
import { t } from '../../lib/type'
import { GetDeep, Loc } from '../../types/_object'
import { getDeep } from '../../utils/_object'
import { $input, $output, messages } from '../constants'

export const createFunctionFactory = <S extends FunTypes.SchemaOptions>(
  { https, logger }: typeof import('firebase-functions'),
  schemaOptions: S,
) => {
  const callable = <
    L extends Loc<S['callable']>,
    _Options = GetDeep<S['callable'], L>,
    Options extends FunTypes.EnsureCallaleOptions<
      _Options
    > = FunTypes.EnsureCallaleOptions<_Options>
  >(
    loc: L,
    builder: FunctionBuilder,
    handler: FunTypes.CallableHandler<Options>,
  ) => {
    type I = Options[typeof $input]
    type O = Options[typeof $output]

    const options = (getDeep(schemaOptions.callable, loc) as any) as Options
    const input = options[$input] as I
    const output = options[$output] as O
    const inputSchema = t.Record(input)

    const wrapped = async (data: unknown, context: https.CallableContext) => {
      const validated = inputSchema.validate(data)

      if (!validated.success) {
        throw new https.HttpsError('invalid-argument', messages.invalidRequest)
      }

      const handlerOutput = await handler(validated.value, context)
      return handlerOutput
    }

    const callable = builder.https.onCall(wrapped)

    return Object.assign(callable, { handler })
  }

  return { callable }
}
