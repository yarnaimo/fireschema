import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Merge } from 'type-fest'
import { $jsonSchema, FunctionRegisterer } from '..'
import { firestoreSchema, User } from './1-1-schema'

/**
 * Registererを初期化
 */
const timezone = 'Asia/Tokyo'
const $register = FunctionRegisterer(
  firestoreSchema,
  firestore,
  functions,
  timezone,
)
const builder = functions.region('asia-northeast1')

/**
 * functionsのindexファイル (functions/index.tsなど)
 * (通常はfunctionごとにファイルを分割します)
 */
export type UserJson = Merge<User, { timestamp: string }>
export const callable = {
  createUser: $register.callable({
    schema: [$jsonSchema<UserJson>(), $jsonSchema<{ result: boolean }>()],
    builder,
    handler: async (data, context) => {
      console.log(data) // UserJson

      return { result: true }
    },
  }),
}

export const firestoreTrigger = {
  onUserCreate: $register.firestoreTrigger.onCreate({
    builder,
    path: 'users/{uid}',
    handler: async (decodedData, snap, context) => {
      console.log(decodedData) // UserDecoded (パス文字列から自動で型付け)
      console.log(snap) // QueryDocumentSnapshot<User>
    },
  }),
}

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
      data // { text: string }
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
