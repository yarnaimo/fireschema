import { createFunctionsSchema, functionInterface } from '../..'
import { t } from '../../lib/type'

const callable = {
  createUser: functionInterface.callable(
    t.Record({
      name: t.String,
      displayName: t.Union(t.String, t.Null),
      age: t.Number,
      tags: t.Array(t.String),
      timestamp: t.String,
    }),
    t.Record({
      result: t.Number,
    }),
  ),
}

const http = {
  getKeys: functionInterface.http(),
}

const topic = {
  publishMessage: functionInterface.topic(
    t.Record({
      text: t.String,
    }),
  ),
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
