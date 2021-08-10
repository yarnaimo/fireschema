import { FTypes, STypes } from '../../types'
import {
  DocumentSnapDataOptions,
  TypedDocumentRef,
  TypedDocumentSnap,
} from './TypedDocumentRef'
import { FirestoreStatic } from './_static'
import { docAsAdmin, docAsWeb, DocDataHelper } from './_utils'

export class TypedTransaction<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
> {
  private readonly dataHelper = new DocDataHelper<F>(
    this.options.firestoreStatic,
  )

  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FirestoreStatic<F>
    },
    readonly raw: FTypes.Transaction<F>,
  ) {}

  async get<L extends string>(typedDoc: TypedDocumentRef<S, F, L>) {
    const snap =
      'create' in this.raw
        ? await this.raw.get(docAsAdmin(typedDoc.raw))
        : await this.raw.get(docAsWeb(typedDoc.raw))

    return new TypedDocumentSnap<S, F, L>(
      { ...this.options, loc: typedDoc.options.loc },
      snap as FTypes.DocumentSnap<STypes.DocDataAt<S, F, L>, F>,
    )
  }

  async getData<
    L extends string,
    U extends STypes.DocDataAt<S, F, L> = STypes.DocDataAt<S, F, L>,
    V = U,
  >(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOptions: DocumentSnapDataOptions<S, F, L, U, V> = {},
  ) {
    const typedSnap = await this.get(typedDoc)
    return typedSnap.data(dataOptions)
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
