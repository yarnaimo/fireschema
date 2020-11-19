import type {
  Change,
  CloudFunction,
  EventContext,
  https,
  HttpsFunction,
  pubsub,
  Request,
  Response,
} from 'firebase-functions'
import { $_ } from '../runtypes'
import { fadmin } from '../types/_firestore'
import { $input, $output, $topicName } from './constants'

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
    [K in string]: CloudFunction<any> | HttpsFunction | NestedFunctions
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
      context: https.CallableContext,
    ) => Promise<O>
  }

  export namespace Http {
    export type Handler = (req: Request, resp: Response) => void | Promise<void>
  }

  export namespace Topic {
    export type Meta<N, I> = { [$topicName]: N; [$input]: I }
    export type EnsureMeta<_C> = _C extends Meta<any, any> ? _C : never

    export type Handler<I> = (
      inputData: I,
      message: pubsub.Message,
      context: EventContext,
    ) => Promise<void>
  }

  export namespace Schedule {
    export type Handler = (context: EventContext) => Promise<void>
  }

  export namespace FirestoreTrigger {
    export type NestedOptions = {
      [K in string]: CloudFunction<any> | NestedOptions
    }

    export type OnCreateOrDeleteHandler<T, U> = (
      decodedData: U,
      snap: fadmin.QueryDocumentSnapshot<T>,
      context: EventContext,
    ) => Promise<void>

    export type OnUpdateHandler<T, U> = (
      decodedData: Change<U>,
      snap: Change<fadmin.QueryDocumentSnapshot<T>>,
      context: EventContext,
    ) => Promise<void>

    export type OnWriteHandler<T, U> = (
      decodedData: Change<U | undefined>,
      snap: Change<fadmin.DocumentSnapshot<T>>,
      context: EventContext,
    ) => Promise<void>
  }
}
