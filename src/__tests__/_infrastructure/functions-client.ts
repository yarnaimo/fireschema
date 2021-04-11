import { PubSub } from '@google-cloud/pubsub'
import { TypedCaller, TypedTopic } from '../..'
import { authedApp } from './_app'
import { emulatorOrigin, projectId } from './_config'

const app = authedApp('user')
const functionsApp = app.functions('asia-northeast1')

functionsApp.useFunctionsEmulator(emulatorOrigin.functions)

type FunctionsModule = typeof import('./functions-server')

export const typedCaller = new TypedCaller<FunctionsModule>(functionsApp)
export const typedTopic = new TypedTopic<FunctionsModule>(
  new PubSub({ apiEndpoint: emulatorOrigin.pubsub, projectId }),
)
