import type {
  EventContext,
  https,
  pubsub,
  Request,
  Response,
} from 'firebase-functions'
import { $ } from '../runtypes'
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
}
