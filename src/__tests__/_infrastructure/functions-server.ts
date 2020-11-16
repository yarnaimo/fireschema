import * as functions from 'firebase-functions'
import { Change } from 'firebase-functions'
import { expectType } from 'tsd'
import { FunctionRegisterer, initFunctions, messages } from '../..'
import { FunTypes } from '../../functions'
import { FirestoreTriggerRegisterer } from '../../functions/factories/firestoreTriggerRegisterer'
import { Type } from '../../lib/type'
import { fadmin } from '../../types/_firestore'
import {
  firestoreSchema,
  IPostA,
  IPostB,
  IUser,
  IUserLocal,
} from '../_fixtures/firestore-schema'
import { functionsSchema } from '../_fixtures/functions-schema'
import { region } from './_config'

const timezone = 'Asia/Tokyo'
const registerFunction = FunctionRegisterer(
  functions,
  functionsSchema,
  timezone,
)
const registerFirestoreTrigger = FirestoreTriggerRegisterer(firestoreSchema)

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

    // @ts-expect-error timestamp
    expectType<Type.Merge<IUser, { timestamp: number }>>(data)

    if (data.age < 0) {
      throw new functions.https.HttpsError('out-of-range', 'out of range')
    } else if (100 <= data.age) {
      throw new Error()
    }
    return { result: data.age ** 2 }
  })
}

const toUpperCaseHandler: FunTypes.Callable.Handler<typeof functionsSchema.callable.nested.toUpperCase> = async (
  data,
  context,
) => {
  return wrap(data, context, async () => {
    expectType<{ text: string }>(data)
    return { result: data.text.toUpperCase() }
  })
}

const callable = {
  createUser: registerFunction.callable('createUser', {
    builder,
    handler: createUserHandler,
  }),
  nested: {
    toUpperCase: registerFunction.callable('nested-toUpperCase', {
      builder,
      handler: toUpperCaseHandler,
    }),
  },
}

!(() => {
  registerFunction.callable(
    // @ts-expect-error: invalid path
    '_createUser',
    { builder, handler: {} as any },
  )
  registerFunction.callable('createUser', {
    builder,
    handler: async (data, context) =>
      // @ts-expect-error: result type
      ({ result: null }),
  })

  registerFunction.callable('nested-toUpperCase', {
    builder,
    handler: async (data, context) =>
      // @ts-expect-error: result type
      ({ result: null }),
  })
})

const http = {
  getKeys: registerFunction.http('getKeys', {
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
  publishMessage: registerFunction.topic('publishMessage', {
    builder,
    handler: async (data) => {
      expectType<{ text: string }>(data)
      console.log(data.text)
    },
  }),
}

const schedule = {
  cron: registerFunction.schedule('cron', {
    builder,
    schedule: '0 0 * * *',
    handler: async (context) => {
      console.log(context.timestamp)
    },
  }),
}

const firestoreTrigger = {
  onPostCreate: registerFirestoreTrigger.onCreate({
    builder,
    path: 'versions/v1/users/{uid}/posts/{postId}',
    handler: async (decodedData, snap, context) => {
      expectType<IPostA | IPostB>(decodedData)
      expectType<fadmin.QueryDocumentSnapshot<IPostA | IPostB>>(snap)

      // @ts-expect-error IUser
      expectType<IUser>(decodedData)

      return { decodedData, snap } as any
    },
  }),

  onUserCreate: registerFirestoreTrigger.onCreate({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<IUserLocal>(decodedData)
      expectType<fadmin.QueryDocumentSnapshot<IUser>>(snap)

      // @ts-expect-error IPostA
      expectType<IPostA>(decodedData)

      return { decodedData, snap } as any
    },
  }),

  onUserDelete: registerFirestoreTrigger.onDelete({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<IUserLocal>(decodedData)
      expectType<fadmin.QueryDocumentSnapshot<IUser>>(snap)

      return { decodedData, snap } as any
    },
  }),

  onUserUpdate: registerFirestoreTrigger.onUpdate({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<Change<IUserLocal>>(decodedData)
      expectType<Change<fadmin.QueryDocumentSnapshot<IUser>>>(snap)

      return { decodedData, snap } as any
    },
  }),

  onUserWrite: registerFirestoreTrigger.onWrite({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<Change<IUserLocal | undefined>>(decodedData)
      expectType<Change<fadmin.DocumentSnapshot<IUser>>>(snap)

      // @ts-expect-error undefined
      expectType<Change<IUserLocal>>(decodedData)
      // @ts-expect-error QueryDocumentSnapshot
      expectType<Change<fadmin.QueryDocumentSnapshot<IUser>>>(snap)

      return { decodedData, snap } as any
    },
  }),
}

export = initFunctions(functionsSchema, {
  callable,
  http,
  topic,
  schedule,
  firestoreTrigger,
})
