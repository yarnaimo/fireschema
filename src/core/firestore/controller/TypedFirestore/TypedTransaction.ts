import { _web } from '../../../../lib/firestore-types'
import { FTypes, STypes } from '../../../types'
import { TypedDocumentRef, TypedDocumentSnap } from './TypedDocumentRef'
import { DocDataHelper } from './_utils'

export class TypedTransaction<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
> {
  private readonly dataHelper = new DocDataHelper<F>(this.firestoreStatic)

  constructor(
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly raw: FTypes.Transaction<F>,
  ) {}

  private get _raw() {
    return this.raw as _web.Transaction
  }
  private _doc<U>(ref: FTypes.DocumentRef<U>) {
    return ref as FTypes.DocumentRef<U, _web.Firestore>
  }

  async get<L extends string>(typedDoc: TypedDocumentRef<S, F, L>) {
    const snap = await this._raw.get(this._doc(typedDoc.raw))

    return new TypedDocumentSnap<S, F, L>(
      this.schemaOptions,
      this.firestoreStatic,
      typedDoc.loc,
      snap as FTypes.DocumentSnap<STypes.DocDataAt<S, F, L>, F>,
    )
  }

  async getData<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    snapshotOptions?: FTypes.SnapshotOptions<F>,
  ) {
    const typedSnap = await this.get(typedDoc)
    return typedSnap.data(snapshotOptions)
  }

  create<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    data: STypes.WriteData<S, F, L>,
  ) {
    this._raw.set(this._doc(typedDoc.raw), ...this.dataHelper.create(data))
    return this
  }

  setMerge<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    data: Partial<STypes.WriteData<S, F, L>>,
  ) {
    this._raw.set(this._doc(typedDoc.raw), ...this.dataHelper.setMerge(data))
    return this
  }

  update<L extends string>(
    typedDoc: TypedDocumentRef<S, F, L>,
    data: Partial<STypes.WriteData<S, F, L>>,
  ) {
    this._raw.update(this._doc(typedDoc.raw), ...this.dataHelper.update(data))
    return this
  }

  delete<L extends string>(typedDoc: TypedDocumentRef<S, F, L>) {
    this._raw.delete(this._doc(typedDoc.raw))
    return this
  }
}
