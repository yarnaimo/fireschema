import { _web } from '../../../../lib/firestore-types'
import { FTypes, STypes } from '../../../types'
import { TypedCollectionRef } from './TypedCollectionRef'
import { TypedFDBase } from './TypedFDBase'
import { DocDataHelper } from './_utils'

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
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly loc: L,
    readonly raw: FTypes.DocumentSnap<U, F>,
  ) {
    this.id = raw.id
    this.exists = raw.exists
    this.typedRef = new TypedDocumentRef<S, F, L, U>(
      schemaOptions,
      firestoreStatic,
      loc,
      raw.ref as FTypes.DocumentRef<U, F>,
    )
  }

  data(options?: FTypes.SnapshotOptions<F>) {
    return this.raw.data(options)
  }
}

export class TypedQueryDocumentSnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedDocumentSnap<S, F, L, U> {
  constructor(
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly loc: L,
    readonly raw: FTypes.QueryDocumentSnap<U, F>,
  ) {
    super(schemaOptions, firestoreStatic, loc, raw)
  }

  data(options?: FTypes.SnapshotOptions<F>) {
    return this.raw.data(options)
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
  private readonly dataHelper = new DocDataHelper<F>(this.firestoreStatic)

  constructor(
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly loc: L,
    readonly raw: FTypes.DocumentRef<U, F>,
  ) {
    super(schemaOptions, firestoreStatic, loc, raw)
    this.id = raw.id
    this.path = raw.path
  }

  parentCollection() {
    return new TypedCollectionRef<S, F, L>(
      this.schemaOptions,
      this.firestoreStatic,
      this.loc,
      this.raw.parent as FTypes.CollectionRef<any, F>,
      true,
    )
  }

  async get(options?: _web.GetOptions) {
    const snap = await this.raw.get(options)

    return new TypedDocumentSnap<S, F, L, U>(
      this.schemaOptions,
      this.firestoreStatic,
      this.loc,
      snap as FTypes.DocumentSnap<U, F>,
    )
  }

  async getData(options?: _web.GetOptions) {
    const typedSnap = await this.get(options)
    return typedSnap.data()
  }

  async create(data: STypes.WriteData<S, F, L>) {
    return this.raw.set(...this.dataHelper.create(data))
  }

  async setMerge(data: Partial<STypes.WriteData<S, F, L>>) {
    return this.raw.set(...this.dataHelper.setMerge(data))
  }

  async update(data: Partial<STypes.WriteData<S, F, L>>) {
    return this.raw.update(...this.dataHelper.update(data))
  }

  async delete() {
    return this.raw.delete()
  }
}
