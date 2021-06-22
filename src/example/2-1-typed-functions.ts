import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Merge } from 'type-fest'
import { $jsonSchema, TypedFunctions } from '..'
import { firestoreSchema, User } from './1-1-schema'

/**
 * Initialize TypedFunctions
 */
const timezone = 'Asia/Tokyo'
const typedFunctions = new TypedFunctions(
  firestoreSchema,
  firestore,
  functions,
  timezone,
)
const builder = functions.region('asia-northeast1')

/**
 * functions/index.ts file
 */
export type UserJson = Merge<User, { timestamp: string }>
export const callable = {
  createUser: typedFunctions.callable({
    schema: {
      input: $jsonSchema<UserJson>(), // schema of request data (automatically validate on request)
      output: $jsonSchema<{ result: boolean }>(), // schema of response data
    },
    builder,
    handler: async (data, context) => {
      console.log(data) // UserJson

      return { result: true }
    },
  }),
}

export const firestoreTrigger = {
  onUserCreate: typedFunctions.firestoreTrigger.onCreate({
    builder,
    path: 'users/{uid}',
    handler: async (decodedData, snap, context) => {
      console.log(decodedData) // UserDecoded (provided based on path string)
      console.log(snap) // QueryDocumentSnapshot<User>
    },
  }),
}

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
    schema: $jsonSchema<{ text: string }>(),
    builder,
    handler: async (data) => {
      data // { text: string }
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
