import { createFunctionsSchema, functionInterface } from '../..'
import { t } from '../../lib/type'

const callable = {
  createUser: functionInterface.callable(
    {
      name: t.String,
      displayName: t.Union(t.String, t.Null),
      age: t.Number,
      tags: t.Array(t.String),
      timestamp: t.String,
    },
    {
      result: t.Number,
    },
  ),
}

const topic = {
  publishMessage: functionInterface.topic({
    text: t.String,
  }),
}

const schedule = {
  cron: functionInterface.schedule(),
}

export const functionsSchema = createFunctionsSchema({
  callable,
  topic,
  schedule,
})
