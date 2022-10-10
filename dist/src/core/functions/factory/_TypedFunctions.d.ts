import * as functions from 'firebase-functions';
import { z } from 'zod';
import { _fadmin } from '../../../lib/functions-types.js';
import { FirestoreModel, InferFirestoreModelS } from '../../firestore/index.js';
import { FunTypes, STypes, SchemaType } from '../../types/index.js';
import { TypedFirestoreTrigger } from './TypedFirestoreTrigger.js';
export declare class TypedFunctions<M extends FirestoreModel<STypes.RootOptions.All>, S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>> {
    readonly model: M;
    readonly timezone: string;
    constructor(model: M, timezone: string);
    firestoreTrigger: TypedFirestoreTrigger<S>;
    callable<SI extends SchemaType._JsonData, SO extends SchemaType._JsonData>({ schema: { input, output }, builder, handler, }: {
        schema: {
            input: SI;
            output: SO;
        };
        builder: _fadmin.FunctionBuilder;
        handler: FunTypes.Callable.Handler<z.infer<SI>, z.infer<SO>>;
    }): functions.HttpsFunction & functions.Runnable<any> & FunTypes.Callable.Meta<SI, SO>;
    http({ builder, handler, }: {
        builder: _fadmin.FunctionBuilder;
        handler: FunTypes.Http.Handler;
    }): functions.HttpsFunction;
    topic<N extends string, S extends SchemaType._JsonData>(topicName: N, { builder, handler, }: {
        schema: S;
        builder: _fadmin.FunctionBuilder;
        handler: FunTypes.Topic.Handler<z.infer<S>>;
    }): functions.CloudFunction<functions.pubsub.Message> & FunTypes.Topic.Meta<N, S>;
    schedule({ builder, schedule, handler, retryConfig, }: {
        builder: _fadmin.FunctionBuilder;
        schedule: string;
        handler: FunTypes.Schedule.Handler;
        retryConfig?: _fadmin.ScheduleRetryConfig;
    }): functions.CloudFunction<unknown>;
}
