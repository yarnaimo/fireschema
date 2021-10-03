import * as functions from 'firebase-functions'
import { expectType } from 'tsd'
import { z } from 'zod'

import { TypedFunctions } from '../../admin/index.js'
import { FunTypes, STypes, messages } from '../../index.js'
import { _admin } from '../../lib/firestore-types'
import { _fadmin } from '../../lib/functions-types'
import { Type } from '../../lib/type.js'
import {
  IPostA,
  IPostB,
  IUser,
  IUserJson,
  IUserLocal,
  UserJsonType,
  firestoreModel,
} from '../_fixtures/firestore-schema.js'
import { region } from './_config.js'

const timezone = 'Asia/Tokyo'
const typedFunctions = new TypedFunctions(firestoreModel, timezone)

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

const createUserSchema = {
  input: UserJsonType,
  output: z.object({ result: z.number().int() }),
}
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

const toUpperCaseSchema = {
  input: z.object({ text: z.string() }),
  output: z.object({ result: z.string() }),
}
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
  createUser: typedFunctions.callable({
    schema: createUserSchema,
    builder,
    handler: createUserHandler,
  }),

  nested: {
    toUpperCase: typedFunctions.callable({
      schema: toUpperCaseSchema,
      builder,
      handler: toUpperCaseHandler,
    }),
  },
}

!(() => {
  typedFunctions.callable({
    schema: createUserSchema,
    builder,
    handler: async (data, context) =>
      // @ts-expect-error: result type
      ({ result: null }),
  })

  typedFunctions.callable({
    schema: toUpperCaseSchema,
    builder,
    handler: async (data, context) =>
      // @ts-expect-error: result type
      ({ result: null }),
  })
})

export const http = {
  getKeys: typedFunctions.http({
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
  publishMessage: typedFunctions.topic('publish_message', {
    schema: z.object({ text: z.string() }),
    builder,
    handler: async (data) => {
      expectType<{ text: string }>(data)
      console.log(data.text)
    },
  }),
}

export const schedule = {
  cron: typedFunctions.schedule({
    builder,
    schedule: '0 0 * * *',
    handler: async (context) => {
      console.log(context.timestamp)
    },
  }),
}

type IUserWithL = IUser & STypes.HasLoc<'versions.users'>
type IPostWithL = (IPostA | IPostB) & STypes.HasLoc<'versions.users.posts'>

export const firestoreTrigger = {
  onPostCreate: typedFunctions.firestoreTrigger.onCreate({
    builder,
    path: 'versions/v1/users/{uid}/posts/{postId}',
    handler: async (decodedData, snap, context) => {
      expectType<IPostA | IPostB>(decodedData)
      expectType<_admin.QueryDocumentSnapshot<IPostWithL>>(snap)

      // @ts-expect-error IUser
      expectType<IUser>(decodedData)

      return { decodedData, snap } as any
    },
  }),

  onUserCreate: typedFunctions.firestoreTrigger.onCreate({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<IUserLocal>(decodedData)
      expectType<_admin.QueryDocumentSnapshot<IUserWithL>>(snap)

      // @ts-expect-error IPostA
      expectType<IPostA>(decodedData)

      return { decodedData, snap } as any
    },
  }),

  onUserDelete: typedFunctions.firestoreTrigger.onDelete({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<IUserLocal>(decodedData)
      expectType<_admin.QueryDocumentSnapshot<IUserWithL>>(snap)

      return { decodedData, snap } as any
    },
  }),

  onUserUpdate: typedFunctions.firestoreTrigger.onUpdate({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<_fadmin.Change<IUserLocal>>(decodedData)
      expectType<_fadmin.Change<_admin.QueryDocumentSnapshot<IUserWithL>>>(snap)

      return { decodedData, snap } as any
    },
  }),

  onUserWrite: typedFunctions.firestoreTrigger.onWrite({
    builder,
    path: 'versions/v1/users/{uid}',
    handler: async (decodedData, snap, context) => {
      expectType<_fadmin.Change<IUserLocal | undefined>>(decodedData)
      expectType<_fadmin.Change<_admin.DocumentSnapshot<IUserWithL>>>(snap)

      // @ts-expect-error undefined
      expectType<_fadmin.Change<IUserLocal>>(decodedData)
      // @ts-expect-error QueryDocumentSnapshot
      expectType<_fadmin.Change<_admin.QueryDocumentSnapshot<IUserWithL>>>(snap)

      return { decodedData, snap } as any
    },
  }),
}
