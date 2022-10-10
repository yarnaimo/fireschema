import { z } from 'zod'
import { _admin } from '../../lib/firestore-types.js'
import { FunctionsErrorFixed, _fadmin } from '../../lib/functions-types.js'
import { ExtractFP, ParseFP } from './_functions.js'
import { GetDeep } from './_object.js'
import type express from 'express'
export declare namespace FunTypes {
  type NestedFunctions = {
    [K in string]:
      | _fadmin.CloudFunction<any>
      | _fadmin.HttpsFunction
      | NestedFunctions
  }
  type FunctionsModule = {
    callable?: NestedFunctions
    http?: NestedFunctions
    topic?: NestedFunctions
    schedule?: NestedFunctions
    firestoreTrigger?: NestedFunctions
  }
  namespace Callable {
    type Meta<I, O> = {
      input: I
      output: O
    }
    type EnsureMeta<_C> = _C extends Meta<any, any> ? _C : never
    type Handler<I, O> = (
      inputData: I,
      context: _fadmin.https.CallableContext,
    ) => Promise<O>
    type GetByFP<
      MC extends NestedFunctions | undefined,
      FP extends ExtractFP<MC>,
    > = EnsureMeta<GetDeep<MC, ParseFP<FP>>>
    type InputOf<
      MC extends NestedFunctions | undefined,
      FP extends ExtractFP<MC>,
    > = z.infer<GetByFP<MC, FP>['input']>
    type OutputOf<
      MC extends NestedFunctions | undefined,
      FP extends ExtractFP<MC>,
    > = z.infer<GetByFP<MC, FP>['output']>
    type CallResult<T, E = FunctionsErrorFixed> =
      | {
          data: T
          error?: never
        }
      | {
          data?: never
          error: E
        }
  }
  namespace Http {
    type Handler = (
      req: _fadmin.https.Request,
      resp: express.Response,
    ) => void | Promise<void>
  }
  namespace Topic {
    type Meta<N, I> = {
      topicName: N
      input: I
    }
    type EnsureMeta<_C> = _C extends Meta<any, any> ? _C : never
    type Handler<I> = (
      inputData: I,
      message: _fadmin.pubsub.Message,
      context: _fadmin.EventContext,
    ) => Promise<void>
  }
  namespace Schedule {
    type Handler = (context: _fadmin.EventContext) => Promise<void>
  }
  namespace FirestoreTrigger {
    type NestedOptions = {
      [K in string]: _fadmin.CloudFunction<any> | NestedOptions
    }
    type OnCreateOrDeleteHandler<T, U> = (
      decodedData: U,
      snap: _admin.QueryDocumentSnapshot<T>,
      context: _fadmin.EventContext,
    ) => Promise<void>
    type OnUpdateHandler<T, U> = (
      decodedData: _fadmin.Change<U>,
      snap: _fadmin.Change<_admin.QueryDocumentSnapshot<T>>,
      context: _fadmin.EventContext,
    ) => Promise<void>
    type OnWriteHandler<T, U> = (
      decodedData: _fadmin.Change<U | undefined>,
      snap: _fadmin.Change<_admin.DocumentSnapshot<T>>,
      context: _fadmin.EventContext,
    ) => Promise<void>
  }
}
