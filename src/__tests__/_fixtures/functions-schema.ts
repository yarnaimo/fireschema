import { callableSchema, createFunctionsSchema } from '../..'
import { topicSchema } from '../../functions'
import { t } from '../../lib/type'

const callable = {
  createUser: callableSchema(
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
  publishMessage: topicSchema({
    text: t.String,
  }),
}

export const functionsSchema = createFunctionsSchema({ callable, topic })
