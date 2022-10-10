import * as functions from 'firebase-functions'
import { z } from 'zod'
import { TypedFunctions } from '../admin/index.js'
import { UserType, firestoreModel } from './1-1-schema.js'
/**
 * Initialize TypedFunctions
 */
const timezone = 'Asia/Tokyo'
const typedFunctions = new TypedFunctions(firestoreModel, timezone)
const builder = functions.region('asia-northeast1')
/**
 * functions/index.ts file
 */
export const UserJsonType = UserType.extend({ timestamp: z.string() })
export const callable = {
  createUser: typedFunctions.callable({
    schema: {
      input: UserJsonType,
      output: z.object({ result: z.boolean() }), // schema of response data
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
    schema: z.object({ text: z.string() }),
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
