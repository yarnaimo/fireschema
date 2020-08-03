import type { EventContext, https, pubsub } from 'firebase-functions'
import { t } from '../lib/type'
import { $input, $output } from './constants'

export declare namespace FunTypes {
  export type RecordBase = { [_: string]: t.Runtype<unknown> }

  export type RecordStaticType<O extends RecordBase> = {
    readonly [K in keyof O]: t.Static<O[K]>
  }

  export type SchemaOptions = {
    callable: NestedOptions
    topic: NestedOptions
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

  export type EnsureIO<_C> = _C extends IO<any, any> ? _C : never

  export type InputType<C extends IO<any, any>> = FunTypes.RecordStaticType<
    C[typeof $input]
  >

  export type OutputType<C extends IO<any, any>> = FunTypes.RecordStaticType<
    C[typeof $output]
  >

  export namespace Callable {
    export type Handler<C extends IO<any, any>> = (
      inputData: InputType<C>,
      context: https.CallableContext,
    ) => Promise<OutputType<C>>
  }

  export namespace Topic {
    export type Handler<C extends IO<any, any>> = (
      inputData: InputType<C>,
      message: pubsub.Message,
      context: EventContext,
    ) => Promise<void>
  }
}
