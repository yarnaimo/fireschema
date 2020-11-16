import { PubSub } from '@google-cloud/pubsub'
import { Caller, TopicClient } from '../..'
import { authedApp } from './_app'
import { emulatorOrigin, projectId } from './_config'

const app = authedApp('user')
const functionsApp = app.functions('asia-northeast1')

functionsApp.useFunctionsEmulator(emulatorOrigin.functions)

type FunctionsModule = typeof import('./functions-server')

export const $call = Caller<FunctionsModule>(functionsApp)
export const $topic = TopicClient<FunctionsModule>(
  new PubSub({ apiEndpoint: emulatorOrigin.pubsub, projectId }),
)
