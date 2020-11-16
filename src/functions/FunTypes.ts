import type {
  Change,
  CloudFunction,
  EventContext,
  https,
  pubsub,
  Request,
  Response,
} from 'firebase-functions'
import { $ } from '../runtypes'
import { fadmin } from '../types/_firestore'
import { $input, $output } from './constants'

export declare namespace FunTypes {
  // export type Jsonfy<T> = {
  //   [K in keyof T]: T[K] extends FTypes.Timestamp
  //     ? string
  //     : T[K] extends Type.Primitive
  //     ? T[K]
  //     : Jsonfy<T[K]>
  // }

  export type JsonSchema<T> = $.Runtype<unknown> & { __T__: T }

  export type RecordBase = $.Runtype<{}>

  export type SchemaOptions = {
    callable: NestedOptions
    http: NestedOptions
    topic: NestedOptions
    schedule: NestedOptions
  }

  export type NestedOptions = {
    [K in string]: IO<any, any> | NestedOptions
  }

  export type IO<I, O> = {
    [$input]: FunTypes.JsonSchema<I>
    [$output]: FunTypes.JsonSchema<O>
  }

  export type EnsureIO<_C> = _C extends IO<any, any> ? _C : never

  export type InputType<C extends IO<any, any>> = C extends IO<infer I, any>
    ? I
    : never

  export type OutputType<C extends IO<any, any>> = C extends IO<any, infer O>
    ? O
    : never

  export namespace Callable {
    export type Handler<C extends IO<any, any>> = (
      inputData: InputType<C>,
      context: https.CallableContext,
    ) => Promise<OutputType<C>>
  }

  export namespace Http {
    export type Handler = (req: Request, resp: Response) => void | Promise<void>
  }

  export namespace Topic {
    export type Handler<C extends IO<any, any>> = (
      inputData: InputType<C>,
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
