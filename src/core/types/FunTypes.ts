import type express from 'express'
import { _admin } from '../../lib/firestore-types'
import { _fadmin } from '../../lib/functions-types'
import { $_ } from '../../runtypes'
import { $input, $output, $topicName } from '../constants'

export declare namespace FunTypes {
  // export type Jsonfy<T> = {
  //   [K in keyof T]: T[K] extends FTypes.Timestamp
  //     ? string
  //     : T[K] extends Type.Primitive
  //     ? T[K]
  //     : Jsonfy<T[K]>
  // }

  export type JsonSchema<T> = $_.Runtype<unknown> & { __T__: T }

  export type NestedFunctions = {
    [K in string]:
      | _fadmin.CloudFunction<any>
      | _fadmin.HttpsFunction
      | NestedFunctions
  }

  export type FunctionsModule = {
    callable: NestedFunctions
    http: NestedFunctions
    topic: NestedFunctions
    schedule: NestedFunctions
    firestoreTrigger: NestedFunctions
  }

  export type SchemaTuple<I, O> = readonly [
    input: FunTypes.JsonSchema<I>,
    output: FunTypes.JsonSchema<O>,
  ]

  export namespace Callable {
    export type Meta<I, O> = { [$input]: I; [$output]: O }
    export type EnsureMeta<_C> = _C extends Meta<any, any> ? _C : never

    export type Handler<I, O> = (
      inputData: I,
      context: _fadmin.https.CallableContext,
    ) => Promise<O>

    export type CallResult<T, E = unknown> =
      | { data: T; error?: never }
      | { data?: never; error: E }
  }

  export namespace Http {
    export type Handler = (
      req: _fadmin.https.Request,
      resp: express.Response,
    ) => void | Promise<void>
  }

  export namespace Topic {
    export type Meta<N, I> = { [$topicName]: N; [$input]: I }
    export type EnsureMeta<_C> = _C extends Meta<any, any> ? _C : never

    export type Handler<I> = (
      inputData: I,
      message: _fadmin.pubsub.Message,
      context: _fadmin.EventContext,
    ) => Promise<void>
  }

  export namespace Schedule {
    export type Handler = (context: _fadmin.EventContext) => Promise<void>
  }

  export namespace FirestoreTrigger {
    export type NestedOptions = {
      [K in string]: _fadmin.CloudFunction<any> | NestedOptions
    }

    export type OnCreateOrDeleteHandler<T, U> = (
      decodedData: U,
      snap: _admin.QueryDocumentSnapshot<T>,
      context: _fadmin.EventContext,
    ) => Promise<void>

    export type OnUpdateHandler<T, U> = (
      decodedData: _fadmin.Change<U>,
      snap: _fadmin.Change<_admin.QueryDocumentSnapshot<T>>,
      context: _fadmin.EventContext,
    ) => Promise<void>

    export type OnWriteHandler<T, U> = (
      decodedData: _fadmin.Change<U | undefined>,
      snap: _fadmin.Change<_admin.DocumentSnapshot<T>>,
      context: _fadmin.EventContext,
    ) => Promise<void>
  }
}
