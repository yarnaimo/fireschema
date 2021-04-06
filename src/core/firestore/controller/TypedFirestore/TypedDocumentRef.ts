import { _web } from '../../../../lib/firestore-types'
import { FTypes, STypes, STypeUtils } from '../../../types'
import { TypedCollectionRef } from './TypedCollectionRef'
import { TypedFDBase } from './TypedFDBase'
import { DocDataHelper } from './_utils'

export class TypedDocumentRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypeUtils.DocDataAt<S, F, L>
> extends TypedFDBase<S, F, L, false, U> {
  readonly id: string
  readonly path: string
  private readonly dataHelper = new DocDataHelper<F>(this.firestoreStatic)

  constructor(
    schemaOptions: S,
    firestoreStatic: FTypes.FirestoreStatic<F>,
    loc: L,
    raw: FTypes.DocumentRef<U, F>,
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
    return snap as FTypes.DocumentSnap<U, F>
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
