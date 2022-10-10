import { PubSub } from '@google-cloud/pubsub';
import { connectFunctionsEmulator } from 'firebase/functions';
import { TypedCaller, TypedTopic } from '../../index.js';
import { getTestAppWeb } from './app.js';
import { emulators, localhost, projectId } from './emulator.js';
const functionsApp = getTestAppWeb('user').functions('asia-northeast1');
connectFunctionsEmulator(functionsApp, localhost, emulators.functions.port);
export const typedCaller = new TypedCaller(functionsApp);
export const typedTopic = new TypedTopic(new PubSub({
    apiEndpoint: `http://${localhost}:${emulators.pubsub.port}`,
    projectId,
}));
