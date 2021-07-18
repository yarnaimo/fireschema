import { FTypes, STypes } from '../../types'
import { TypedCollectionRef } from './TypedCollectionRef'
import { TypedFDBase } from './TypedFDBase'
import { DocDataHelper } from './_utils'

export type DocumentSnapTransformer<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = (data: U, snap: TypedDocumentSnap<S, F, L, U>) => V

export type QueryDocumentSnapTransformer<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = (data: U, snap: TypedQueryDocumentSnap<S, F, L, U>) => V

export const withRefTransformer = <
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
>(
  data: U,
  snap: TypedDocumentSnap<S, F, L, U>,
) => ({ ...data, ref: snap.typedRef })

export type DocumentSnapDataOptions<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = {
  snapshotOptions?: FTypes.SnapshotOptions<F>
  transformer?: DocumentSnapTransformer<S, F, L, U, V>
}

export type QueryDocumentSnapDataOptions<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U,
  V,
> = {
  snapshotOptions?: FTypes.SnapshotOptions<F>
  transformer?: QueryDocumentSnapTransformer<S, F, L, U, V>
}

export class TypedDocumentSnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly typedRef: TypedDocumentRef<S, F, L, U>
  readonly id: string
  readonly exists: boolean

  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FTypes.FirestoreStatic<F>
      loc: L
    },
    readonly raw: FTypes.DocumentSnap<U, F>,
  ) {
    this.id = raw.id
    this.exists = raw.exists
    this.typedRef = new TypedDocumentRef<S, F, L, U>(
      this.options,
      raw.ref as FTypes.DocumentRef<U, F>,
    )
  }

  data<V = U>({
    snapshotOptions,
    transformer,
  }: DocumentSnapDataOptions<S, F, L, U, V> = {}): V | undefined {
    const data = this.raw.data(snapshotOptions)
    if (!data) {
      return undefined
    }
    return transformer?.(data, this) ?? (data as unknown as V)
  }
}

export class TypedQueryDocumentSnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedDocumentSnap<S, F, L, U> {
  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FTypes.FirestoreStatic<F>
      loc: L
    },
    readonly raw: FTypes.QueryDocumentSnap<U, F>,
  ) {
    super(options, raw)
  }

  data<V = U>({
    snapshotOptions,
    transformer,
  }: QueryDocumentSnapDataOptions<S, F, L, U, V> = {}): V {
    const data = this.raw.data(snapshotOptions)
    return transformer?.(data, this) ?? (data as unknown as V)
  }
}

export class TypedDocumentRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedFDBase<S, F, L, false, U> {
  readonly id: string
  readonly path: string
  private readonly dataHelper = new DocDataHelper<F>(
    this.options.firestoreStatic,
  )

  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FTypes.FirestoreStatic<F>
      loc: L
    },
    readonly raw: FTypes.DocumentRef<U, F>,
  ) {
    super(options, raw)
    this.id = raw.id
    this.path = raw.path
  }

  private wrapWriteResult(
    writeResult: FTypes.WriteResult<FTypes.FirestoreApp>,
  ) {
    return writeResult as FTypes.WriteResult<F>
  }

  parentCollection() {
    return new TypedCollectionRef<S, F, L>(
      this.options,
      this.raw.parent as FTypes.CollectionRef<any, F>,
      true,
    )
  }

  async get(getOptions?: FTypes.GetOptions<F>) {
    const snap = await this.raw.get(getOptions)

    return new TypedDocumentSnap<S, F, L, U>(
      this.options,
      snap as FTypes.DocumentSnap<U, F>,
    )
  }

  async getData<V = U>({
    getOptions,
    ...dataOptions
  }: {
    getOptions?: FTypes.GetOptions<F>
  } & DocumentSnapDataOptions<S, F, L, U, V> = {}): Promise<V | undefined> {
    const typedSnap = await this.get(getOptions)
    return typedSnap.data(dataOptions)
  }

  async create(data: STypes.WriteData<S, F, L>) {
    const args = this.dataHelper.create(data)

    return this.wrapWriteResult(
      'create' in this.raw
        ? await this.raw.create(...args)
        : await this.raw.set(...args),
    )
  }

  async setMerge(data: Partial<STypes.WriteData<S, F, L>>) {
    return this.wrapWriteResult(
      await this.raw.set(...this.dataHelper.setMerge(data)),
    )
  }

  async update(data: Partial<STypes.WriteData<S, F, L>>) {
    return this.wrapWriteResult(
      await this.raw.update(...this.dataHelper.update(data)),
    )
  }

  async delete() {
    return this.wrapWriteResult(await this.raw.delete())
  }
}
