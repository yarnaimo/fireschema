import { _web } from '../../../../lib/firestore-types'
import { FTypes, STypes } from '../../../types'
import { TypedDocumentRef } from './TypedDocumentRef'
import { DocDataHelper } from './_utils'

export class TypedWriteBatch<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp
> {
  private readonly dataHelper = new DocDataHelper<F>(this.firestoreStatic)

  constructor(
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly raw: FTypes.WriteBatch<F>,
  ) {}

  private get _raw() {
    return this.raw as _web.WriteBatch
  }
  private _doc<U>(ref: FTypes.DocumentRef<U>) {
    return ref as FTypes.DocumentRef<U, _web.Firestore>
  }

  commit(): Promise<void> {
    return this._raw.commit()
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
