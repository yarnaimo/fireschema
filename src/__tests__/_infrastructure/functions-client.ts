import { PubSub } from '@google-cloud/pubsub'
import { initCaller, initTopicClient } from '../..'
import { functionsSchema } from '../_fixtures/functions-schema'
import { authedApp, emulatorOrigin, projectId } from './_app'

const app = authedApp('user')
const functionsApp = app.functions('asia-northeast1')

functionsApp.useFunctionsEmulator(emulatorOrigin.functions)

export const $call = initCaller(functionsApp, functionsSchema)
export const $topic = initTopicClient(
  new PubSub({ apiEndpoint: `http://localhost:8085`, projectId }),
  functionsSchema,
)
