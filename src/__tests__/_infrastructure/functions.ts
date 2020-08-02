import { initCaller } from '../..'
import { functionsSchema } from '../_fixtures/functions-schema'
import { authedApp } from './_app'

const app = authedApp('user')
const functionsApp = app.functions('asia-northeast1')
functionsApp.useFunctionsEmulator('http://localhost:5001')

export const v1Caller = initCaller(functionsApp, functionsSchema, 'v1')
