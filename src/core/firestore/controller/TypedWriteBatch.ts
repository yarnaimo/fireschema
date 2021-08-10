import { FTypes, STypes } from '../../types'
import { TypedDocumentRef } from './TypedDocumentRef'
import { FirestoreStatic } from './_static'
import { docAsAdmin, docAsWeb, DocDataHelper } from './_utils'

export class TypedWriteBatch<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
> {
  private readonly dataHelper = new DocDataHelper<F>(this.firestoreStatic)

  constructor(
    readonly firestoreStatic: FirestoreStatic<F>,
    readonly raw: FTypes.WriteBatch<F>,
  ) {}

  async commit() {
    return (await this.raw.commit()) as FTypes.WriteResultArray<F>
  }

  create<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    data: STypes.WriteData<S, F, L>,
  ) {
    const args = this.dataHelper.create(data)

    if ('create' in this.raw) {
      this.raw.create(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.set(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }

  setMerge<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    data: Partial<STypes.WriteData<S, F, L>>,
  ) {
    const args = this.dataHelper.setMerge(data)

    if ('create' in this.raw) {
      this.raw.set(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.set(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }

  update<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    data: Partial<STypes.WriteData<S, F, L>>,
  ) {
    const args = this.dataHelper.update(data)

    if ('create' in this.raw) {
      this.raw.update(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.update(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }

  delete<L extends string>(typedDoc: TypedDocumentRef<S, F, L>) {
    if ('create' in this.raw) {
      this.raw.delete(docAsAdmin(typedDoc.raw))
    } else {
      this.raw.delete(docAsWeb(typedDoc.raw))
    }
    return this
  }
}
