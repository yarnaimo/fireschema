import { https } from 'firebase-functions'
import { t } from '../lib/type'
import { $input, $output } from './constants'

export declare namespace FunTypes {
  export type RecordBase = { [_: string]: t.Runtype<unknown> }

  export type RecordStaticType<O extends RecordBase> = {
    readonly [K in keyof O]: t.Static<O[K]>
  }

  export type SchemaOptions = {
    callable: NestedCallableOptions
  }

  export type NestedCallableOptions = {
    [K in string]: CallableOption<any, any> | NestedCallableOptions
  }

  export type EnsureCallaleOptions<
    _Options
  > = _Options extends FunTypes.CallableOption<any, any> ? _Options : never

  export type CallableOption<
    I extends FunTypes.RecordBase,
    O extends FunTypes.RecordBase
  > = {
    [$input]: I
    [$output]: O
  }

  export type InputType<
    Options extends CallableOption<any, any>
  > = FunTypes.RecordStaticType<Options[typeof $input]>

  export type OutputType<
    Options extends CallableOption<any, any>
  > = FunTypes.RecordStaticType<Options[typeof $output]>

  export type CallableHandler<
    Options extends FunTypes.CallableOption<any, any>
  > = (
    inputData: FunTypes.InputType<Options>,
    context: https.CallableContext,
  ) => Promise<FunTypes.OutputType<Options>>
}
