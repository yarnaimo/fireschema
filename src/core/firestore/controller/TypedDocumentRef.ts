import { FTypes, STypes } from '../../types/index.js'
import { TypedConstructorOptions } from './ConstructorOptions.js'
import { TypedCollectionRef } from './TypedCollectionRef.js'
import { TypedFDBase } from './TypedFDBase.js'
import {
  GetSource,
  deleteDocUniv,
  existsUniv,
  getDocUniv,
  setDocUniv,
  updateDocUniv,
} from './_universal.js'
import { DataOrFn, DocDataHelper } from './_utils.js'

export class DocumentNotExistsError extends Error {}

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
) => ({ ...data, ref: snap.ref })

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
  readonly ref: TypedDocumentRef<S, F, L, U>
  readonly id: string

  constructor(
    readonly options: TypedConstructorOptions<S, F, L>,
    readonly raw: FTypes.DocumentSnap<U, F>,
  ) {
    this.id = raw.id
    this.ref = new TypedDocumentRef<S, F, L, U>(
      this.options,
      raw.ref as FTypes.DocumentRef<U, F>,
    )
  }

  exists(): this is TypedQueryDocumentSnap<S, F, L, U> {
    return existsUniv(this.raw)
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
    readonly options: TypedConstructorOptions<S, F, L>,
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
    readonly options: TypedConstructorOptions<S, F, L>,
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

  async get({ from }: { from?: GetSource } = {}) {
    const snap = await getDocUniv(this.raw, from)

    return new TypedDocumentSnap<S, F, L, U>(
      this.options,
      snap as FTypes.DocumentSnap<U, F>,
    )
  }

  async getData<V = U>({
    from,
    ...dataOptions
  }: {
    from?: GetSource
  } & DocumentSnapDataOptions<S, F, L, U, V> = {}): Promise<V | undefined> {
    const typedSnap = await this.get({ from })
    return typedSnap.data(dataOptions)
  }

  async getDataOrThrow<V = U>(
    options: {
      from?: GetSource
    } & DocumentSnapDataOptions<S, F, L, U, V> = {},
  ): Promise<V> {
    const data = await this.getData(options)
    if (!data) {
      throw new DocumentNotExistsError(`Document ${this.path} not exists`)
    }
    return data
  }

  async create(dataOrFn: DataOrFn<STypes.WriteData<S, F, L>>) {
    const args = this.dataHelper.create(dataOrFn)

    return this.wrapWriteResult(
      'create' in this.raw
        ? await this.raw.create(...args)
        : await setDocUniv(this.raw, ...args),
    )
  }

  async setMerge(dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>) {
    return this.wrapWriteResult(
      await setDocUniv(this.raw, ...this.dataHelper.setMerge(dataOrFn)),
    )
  }

  async update(dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>) {
    return this.wrapWriteResult(
      await updateDocUniv(this.raw, ...this.dataHelper.update(dataOrFn)),
    )
  }

  async delete() {
    return this.wrapWriteResult(await deleteDocUniv(this.raw))
  }
}
