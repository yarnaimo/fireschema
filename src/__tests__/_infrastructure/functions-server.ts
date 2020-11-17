import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Change } from 'firebase-functions'
import { expectType } from 'tsd'
import { $jsonSchema, FunctionRegisterer, FunTypes, messages } from '../..'
import { Type } from '../../lib/type'
import { fadmin } from '../../types/_firestore'
import {
  firestoreSchema,
  IPostA,
  IPostB,
  IUser,
  IUserJson,
  IUserLocal,
} from '../_fixtures/firestore-schema'
import { region } from './_config'

const timezone = 'Asia/Tokyo'
const $register = FunctionRegisterer(
  firestoreSchema,
  firestore,
  functions,
  timezone,
)

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

const createUserSchema = [
  $jsonSchema<IUserJson>(),
  $jsonSchema<{ result: number }>(),
] as const
const createUserHandler: FunTypes.Callable.Handler<
  IUserJson,
  { result: number }
> = async (data, context) => {
  return wrap(data, context, async () => {
    expectType<IUserJson>(data)

    // @ts-expect-error timestamp
    expectType<Type.Merge<IUserJson, { timestamp: number }>>(data)

    if (data.age < 0) {
      throw new functions.https.HttpsError('out-of-range', 'out of range')
    } else if (100 <= data.age) {
      throw new Error()
    }
    return { result: data.age ** 2 }
  })
}

const toUpperCaseSchema = [
  $jsonSchema<{ text: string }>(),
  $jsonSchema<{ result: string }>(),
] as const
const toUpperCaseHandler: FunTypes.Callable.Handler<
  { text: string },
  { result: string }
> = async (data, context) => {
  return wrap(data, context, async () => {
    expectType<{ text: string }>(data)
    return { result: data.text.toUpperCase() }
  })
}

export const callable = {
  createUser: $register.callable({
    schema: createUserSchema,
    builder,
    handler: createUserHandler,
  }),

  nested: {
    toUpperCase: $register.callable({
      schema: toUpperCaseSchema,
      builder,
      handler: toUpperCaseHandler,
    }),
  },
}

!(() => {
  $register.callable({
    schema: createUserSchema,
    builder,
    handler: async (data, context) =>
      // @ts-expect-error: result type
      ({ result: null }),
  })

  $register.callable({
    schema: toUpperCaseSchema,
    builder,
    handler: async (data, context) =>
      // @ts-expect-error: result type
      ({ result: null }),
  })
})

export const http = {
  getKeys: $register.http({
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

export const topic = {
  publishMessage: $register.topic('publish_message', {
    schema: $jsonSchema<{ text: string }>(),
    builder,
    handler: async (data) => {
      expectType<{ text: string }>(data)
      console.log(data.text)
    },
  }),
}

export const schedule = {
  cron: $register.schedule({
    builder,
    schedule: '0 0 * * *',
    handler: async (context) => {
      console.log(context.timestamp)
    },
  }),
}

export const firestoreTrigger = {
  onPostCreate: $register.firestoreTrigger.onCreate({
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

  onUserCreate: $register.firestoreTrigger.onCreate({
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

  onUserDelete: $register.firestoreTrigger.onDelete({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<IUserLocal>(decodedData)
      expectType<fadmin.QueryDocumentSnapshot<IUser>>(snap)

      return { decodedData, snap } as any
    },
  }),

  onUserUpdate: $register.firestoreTrigger.onUpdate({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<Change<IUserLocal>>(decodedData)
      expectType<Change<fadmin.QueryDocumentSnapshot<IUser>>>(snap)

      return { decodedData, snap } as any
    },
  }),

  onUserWrite: $register.firestoreTrigger.onWrite({
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
