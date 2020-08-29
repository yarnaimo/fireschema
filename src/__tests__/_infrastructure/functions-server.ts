import * as functions from 'firebase-functions'
import { expectType } from 'tsd'
import { initFunctionRegisterer, initFunctions, messages } from '../..'
import { FunTypes } from '../../functions'
import { Type } from '../../lib/type'
import { IUser } from '../_fixtures/firestore-schema'
import { functionsSchema } from '../_fixtures/functions-schema'
import { region } from './_config'

const timezone = 'Asia/Tokyo'
const $register = initFunctionRegisterer(functions, functionsSchema, timezone)

const builder = functions.region(region)

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

const createUserHandler: FunTypes.Callable.Handler<typeof functionsSchema.callable.createUser> = async (
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

const callable = {
  createUser: $register.callable(['createUser'], {
    builder,
    handler: createUserHandler,
  }),
}

const _errorExpected = $register.callable(['createUser'], {
  builder,
  // @ts-expect-error: result
  handler: async (data, context) => ({ result: null }),
})

const http = {
  getKeys: $register.http(['getKeys'], {
    builder,
    handler: (req, resp) => {
      if (req.method !== 'POST') {
        resp.status(400).send()
        return
      }
      resp.json(Object.keys(req.body))
    },
  }),
}

const topic = {
  publishMessage: $register.topic(['publishMessage'], {
    builder,
    handler: async (data) => {
      expectType<{ text: string }>(data)
      console.log(data.text)
    },
  }),
}

const schedule = {
  cron: $register.schedule(['cron'], {
    builder,
    schedule: '0 0 * * *',
    handler: async (context) => {
      console.log(context.timestamp)
    },
  }),
}

export = initFunctions(functionsSchema, { callable, http, topic, schedule })
