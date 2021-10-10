import { _admin, _web } from '../../../lib/firestore-types'
import { is } from '../../../lib/type.js'
import { _createdAt, _updatedAt } from '../../constants/index.js'
import { FTypes } from '../../types/index.js'
import { FirestoreStatic } from './_static.js'

export const docAsWeb = <U>(ref: FTypes.DocumentRef<U>) => {
  return ref as FTypes.DocumentRef<U, _web.Firestore>
}
export const docAsAdmin = <U>(ref: FTypes.DocumentRef<U>) => {
  return ref as FTypes.DocumentRef<U, _admin.Firestore>
}

export type DataOrFn<T> =
  | T
  | (<F extends FTypes.FirestoreApp>(firestoreStatic: FirestoreStatic<F>) => T)

export class DocDataHelper<F extends FTypes.FirestoreApp> {
  mergeOptions = { merge: true }

  constructor(readonly firestoreStatic: FirestoreStatic<F>) {}

  private toCreate<T>(data: T): any {
    return {
      ...data,
      [_createdAt]: this.firestoreStatic.serverTimestamp(),
      [_updatedAt]: this.firestoreStatic.serverTimestamp(),
    }
  }
  private toUpdate<T>(data: T): any {
    return {
      ...data,
      [_updatedAt]: this.firestoreStatic.serverTimestamp(),
    }
  }

  private dataOf<T>(dataOrFn: DataOrFn<T>): T {
    return is.function_(dataOrFn) ? dataOrFn(this.firestoreStatic) : dataOrFn
  }

  create<T>(dataOrFn: DataOrFn<T>) {
    return [this.toCreate(this.dataOf(dataOrFn))] as const
  }
  setMerge<T>(dataOrFn: DataOrFn<T>) {
    return [this.toUpdate(this.dataOf(dataOrFn)), this.mergeOptions] as const
  }
  update<T>(dataOrFn: DataOrFn<T>) {
    return [this.toUpdate(this.dataOf(dataOrFn))] as const
  }
}
