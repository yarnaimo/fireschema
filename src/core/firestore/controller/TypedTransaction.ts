import { FTypes, STypes } from '../../types/index.js'
import { TypedConstructorOptionsWithoutLoc } from './ConstructorOptions.js'
import {
  DocumentSnapDataOptions,
  TypedDocumentRef,
  TypedDocumentSnap,
} from './TypedDocumentRef.js'
import { DataOrFn, DocDataHelper, docAsAdmin, docAsWeb } from './_utils.js'

export class TypedTransaction<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
> {
  private readonly dataHelper = new DocDataHelper<F>(
    this.options.firestoreStatic,
  )

  constructor(
    readonly options: TypedConstructorOptionsWithoutLoc<S, F>,
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
    return typedSnap.data(
      // @ts-ignore TODO:
      dataOptions,
    )
  }

  create<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOrFn: DataOrFn<STypes.WriteData<S, F, L>>,
  ) {
    const args = this.dataHelper.create(dataOrFn)

    if ('create' in this.raw) {
      this.raw.create(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.set(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }

  setMerge<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>,
  ) {
    const args = this.dataHelper.setMerge(dataOrFn)

    if ('create' in this.raw) {
      this.raw.set(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.set(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }

  update<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    dataOrFn: DataOrFn<Partial<STypes.WriteData<S, F, L>>>,
  ) {
    const args = this.dataHelper.update(dataOrFn)

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
