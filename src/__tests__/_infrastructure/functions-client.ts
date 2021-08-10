import { PubSub } from '@google-cloud/pubsub'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { TypedCaller, TypedTopic } from '../..'
import { authedApp } from './_app'
import { emulatorConfig, localhost, projectId } from './_config'

const app = authedApp('user')
const functionsApp = getFunctions(app, 'asia-northeast1')

connectFunctionsEmulator(functionsApp, localhost, emulatorConfig.functions.port)

type FunctionsModule = typeof import('./functions-server')

export const typedCaller = new TypedCaller<FunctionsModule>(functionsApp)
export const typedTopic = new TypedTopic<FunctionsModule>(
  new PubSub({
    apiEndpoint: `http://${localhost}:${emulatorConfig.pubsub.port}`,
    projectId,
  }),
)
