import { https } from 'firebase-functions'
import { t } from '../lib/type'
import { $input, $output } from './constants'

export declare namespace FunTypes {
  export type RecordBase = { [_: string]: t.Runtype<unknown> }

  export type RecordStaticType<O extends RecordBase> = {
    readonly [K in keyof O]: t.Static<O[K]>
  }

  export type SchemaOptions = {
    callable: Callable.NestedOptions
  }

  export namespace Callable {
    export type NestedOptions = {
      [K in string]: Options<any, any> | Callable.NestedOptions
    }

    export type EnsureOption<_T> = _T extends Options<any, any> ? _T : never

    export type Options<
      I extends FunTypes.RecordBase,
      O extends FunTypes.RecordBase
    > = {
      [$input]: I
      [$output]: O
    }

    export type InputType<
      C extends Options<any, any>
    > = FunTypes.RecordStaticType<C[typeof $input]>

    export type OutputType<
      C extends Options<any, any>
    > = FunTypes.RecordStaticType<C[typeof $output]>

    export type Handler<C extends FunTypes.Callable.Options<any, any>> = (
      inputData: InputType<C>,
      context: https.CallableContext,
    ) => Promise<OutputType<C>>
  }
}
