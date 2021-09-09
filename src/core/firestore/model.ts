import { InferSchemaType, SchemaType, STypes } from '../types/index.js'

type GetU<S extends SchemaType._DocData, D> = D extends STypes.Model.Decoder<
  any,
  infer U
>
  ? U
  : InferSchemaType<S>

export type InferDataModelT<M extends DataModel<any, any, any>> =
  InferSchemaType<M['schema']>

export type InferDataModelU<M extends DataModel<any, any, any>> = GetU<
  M['schema'],
  M['decoder']
>

export type InferDataModelSL<M extends DataModel<any, any, any>> = ReturnType<
  M['selectors']
>

export class DataModel<
  S extends SchemaType._DocData,
  D extends
    | STypes.Model.Decoder<InferSchemaType<S>, any>
    | undefined = undefined,
  SL extends STypes.Model.SelectorsConstraint = {},
> {
  readonly schema: S
  readonly decoder: D
  readonly selectors: STypes.Model.Selectors<InferSchemaType<S>, SL>

  constructor({
    schema,
    decoder,
    selectors = () => ({} as SL),
  }: {
    schema: S
    decoder?: D
    selectors?: STypes.Model.Selectors<InferSchemaType<S>, SL>
  }) {
    this.schema = schema
    this.decoder = decoder as D
    this.selectors = selectors
  }
}

export type InferFirestoreModelS<M extends FirestoreModel<any>> =
  M extends FirestoreModel<infer S> ? S : never

export class FirestoreModel<S extends STypes.RootOptions.All> {
  constructor(readonly schemaOptions: S) {}
}
