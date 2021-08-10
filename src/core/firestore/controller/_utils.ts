import { _admin, _web } from '../../../lib/firestore-types'
import { _createdAt, _updatedAt } from '../../constants'
import { FTypes } from '../../types'
import { FirestoreStatic } from './_static'

export const docAsWeb = <U>(ref: FTypes.DocumentRef<U>) => {
  return ref as FTypes.DocumentRef<U, _web.Firestore>
}
export const docAsAdmin = <U>(ref: FTypes.DocumentRef<U>) => {
  return ref as FTypes.DocumentRef<U, _admin.Firestore>
}

export class DocDataHelper<F extends FTypes.FirestoreApp> {
  mergeOptions = { merge: true }

  constructor(readonly firestoreStatic: FirestoreStatic<F>) {}

  _toCreate<T>(data: T): any {
    return {
      ...data,
      [_createdAt]: this.firestoreStatic.serverTimestamp(),
      [_updatedAt]: this.firestoreStatic.serverTimestamp(),
    }
  }
  _toUpdate<T>(data: T): any {
    return {
      ...data,
      [_updatedAt]: this.firestoreStatic.serverTimestamp(),
    }
  }

  create<T>(data: T) {
    return [this._toCreate(data)] as const
  }
  setMerge<T>(data: T) {
    return [this._toUpdate(data), this.mergeOptions] as const
  }
  update<T>(data: T) {
    return [this._toUpdate(data)] as const
  }
}
