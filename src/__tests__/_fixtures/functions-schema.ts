import { callableSchema, createFunctionsSchema } from '../..'
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

export const functionsSchema = createFunctionsSchema({ callable })
