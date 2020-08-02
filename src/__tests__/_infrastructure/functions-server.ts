import * as functions from 'firebase-functions'
import { expectType } from 'tsd'
import { createFunctionFactory, initFunctions, messages } from '../..'
import { FunTypes } from '../../functions'
import { Type } from '../../lib/type'
import { IUser } from '../_fixtures/firestore-schema'
import { functionsSchema } from '../_fixtures/functions-schema'

const functionFactory = createFunctionFactory(functions, functionsSchema)

const wrap = async <T, U>(
  data: T,
  context: functions.https.CallableContext,
  fn: (data: T, context: functions.https.CallableContext) => Promise<U>,
) => {
  try {
    const output = await fn(data, context)
    return output
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error
    } else {
      functions.logger.error(error)
      throw new functions.https.HttpsError('internal', messages.unknown)
    }
  }
}

const handler: FunTypes.CallableHandler<
  typeof functionsSchema['callable']['createUser']
> = async (data, context) => {
  return wrap(data, context, async () => {
    expectType<Type.Merge<IUser, { timestamp: string }>>(data)

    if (data.age < 0) {
      throw new functions.https.HttpsError('out-of-range', 'out of range')
    } else if (100 <= data.age) {
      throw new Error()
    }
    return { result: data.age ** 2 }
  })
}

const createUser = functionFactory.callable(
  ['createUser'],
  functions.region('asia-northeast1'),
  handler,
)
const _errorExpected = functionFactory.callable(
  ['createUser'],
  functions.region('asia-northeast1'),
  // @ts-expect-error
  async (data, context) => ({ result: null }),
)

const callable = { createUser }

export const v1 = initFunctions(functionsSchema, { callable })
