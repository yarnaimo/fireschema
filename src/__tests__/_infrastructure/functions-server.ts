import * as functions from 'firebase-functions'
import { Do } from 'lifts'
import { expectType } from 'tsd'
import { initFunctionRegisterer, initFunctions, messages } from '../..'
import { FunTypes } from '../../functions'
import { Type } from '../../lib/type'
import { IUser } from '../_fixtures/firestore-schema'
import { functionsSchema } from '../_fixtures/functions-schema'

const $register = initFunctionRegisterer(functions, functionsSchema)

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
      throw new functions.https.HttpsError('internal', messages.unknown)
    }
  }
}

const handler: FunTypes.Callable.Handler<typeof functionsSchema.callable.createUser> = async (
  data,
  context,
) => {
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

const region = functions.region('asia-northeast1')

const callable = Do(() => {
  const createUser = $register.callable(['createUser'], region, handler)

  const _errorExpected = $register.callable(
    ['createUser'],
    region,
    // @ts-expect-error
    async (data, context) => ({ result: null }),
  )

  return { createUser }
})

const topic = Do(() => {
  const publishMessage = $register.topic(
    ['publishMessage'],
    region,
    async (data) => {
      expectType<{ text: string }>(data)
      console.log(data.text)
    },
  )

  return { publishMessage }
})

export = initFunctions(functionsSchema, { callable, topic })
