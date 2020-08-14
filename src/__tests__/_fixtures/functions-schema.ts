import { createFunctionsSchema, functionInterface } from '../..'
import { Type } from '../../lib/type'
import { IUser, UserSchema } from './firestore-schema'

const callable = {
  createUser: functionInterface.callable<
    Type.Merge<IUser, { timestamp: string }>,
    { result: number }
  >(
    {
      ...UserSchema,
      timestamp: 'string',
    },
    {
      result: 'int',
    },
  ),
}

const http = {
  getKeys: functionInterface.http(),
}

const topic = {
  publishMessage: functionInterface.topic<{ text: string }>({
    text: 'string',
  }),
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
