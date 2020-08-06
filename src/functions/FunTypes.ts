import type {
  EventContext,
  https,
  pubsub,
  Request,
  Response,
} from 'firebase-functions'
import { t } from '../lib/type'
import { $input, $output } from './constants'

export declare namespace FunTypes {
  export type RecordBase = t.Record<{}, false>

  export type SchemaOptions = {
    callable: NestedOptions
    http: NestedOptions
    topic: NestedOptions
    schedule: NestedOptions
  }

  export type NestedOptions = {
    [K in string]: IO<any, any> | NestedOptions
  }

  export type IO<
    I extends FunTypes.RecordBase,
    O extends FunTypes.RecordBase
  > = {
    [$input]: I
    [$output]: O
  }

  export type EnsureIO<_C> = _C extends IO<
    FunTypes.RecordBase,
    FunTypes.RecordBase
  >
    ? _C
    : never

  export type InputType<C extends IO<any, any>> = t.Static<C[typeof $input]>

  export type OutputType<C extends IO<any, any>> = t.Static<C[typeof $output]>

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
