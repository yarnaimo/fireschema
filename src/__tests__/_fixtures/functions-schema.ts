import { createFunctionsSchema, functionInterface } from '../..'
import { $jsonSchema } from '../../functions'
import { Type } from '../../lib/type'
import { IUser } from './firestore-schema'

const callable = {
  createUser: functionInterface.callable(
    $jsonSchema<Type.Merge<IUser, { timestamp: string }>>(),
    $jsonSchema<{ result: number }>(),
  ),
}

const http = {
  getKeys: functionInterface.http(),
}

const topic = {
  publishMessage: functionInterface.topic($jsonSchema<{ text: string }>()),
}

const schedule = {
  cron: functionInterface.schedule(),
}

export const functionsSchema = createFunctionsSchema({
  callable,
  http,
  topic,
  schedule,
})
