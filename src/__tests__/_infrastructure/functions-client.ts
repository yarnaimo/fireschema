import { PubSub } from '@google-cloud/pubsub'
import { initCaller, initTopicClient } from '../..'
import { functionsSchema } from '../_fixtures/functions-schema'
import { authedApp } from './_app'
import { emulatorOrigin, projectId } from './_config'

const app = authedApp('user')
const functionsApp = app.functions('asia-northeast1')

functionsApp.useFunctionsEmulator(emulatorOrigin.functions)

export const $call = initCaller(functionsApp, functionsSchema)
export const $topic = initTopicClient(
  new PubSub({ apiEndpoint: `http://localhost:8085`, projectId }),
  functionsSchema,
)
