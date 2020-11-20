import { _admin, _web } from '../../../lib/firestore-types'
import { _createdAt, _updatedAt } from '../../constants'
import { FTypes, STypes } from '../../types'

type UnknownT = STypes.HasT<unknown>

type ToCreate<
  U extends UnknownT,
  F extends FTypes.FirestoreApp
> = STypes.DocDataToWrite<U['__T__'], F>

type ToUpdate<U extends UnknownT, F extends FTypes.FirestoreApp> = Partial<
  ToCreate<U, F>
>

const WithMeta = (FieldValue: FTypes.FieldValueClass) => {
  return {
    toCreate: <U extends STypes.HasT<unknown>>(data: {}) =>
      (({
        ...data,
        [_createdAt]: FieldValue.serverTimestamp(),
        [_updatedAt]: FieldValue.serverTimestamp(),
      } as any) as U['__T__']),

    toUpdate: <U extends STypes.HasT<unknown>>(data: {}) =>
      (({
        ...data,
        [_updatedAt]: FieldValue.serverTimestamp(),
      } as any) as U['__T__']),
  }
}

const _mergeOptions = { merge: true }

/**
 * Interactor
 */
export type Interactor<F extends FTypes.FirestoreApp> = {
  create: <U extends UnknownT>(
    docRef: FTypes.DocumentRef<U, F>,
    data: ToCreate<U, F>,
  ) => FTypes.SetResult<F>

  setMerge: <U extends UnknownT>(
    docRef: FTypes.DocumentRef<U, F>,
    data: ToUpdate<U, F>,
  ) => FTypes.SetResult<F>

  update: <U extends UnknownT>(
    docRef: FTypes.DocumentRef<U, F>,
    data: ToUpdate<U, F>,
  ) => FTypes.SetResult<F>

  delete: (docRef: FTypes.DocumentRef<any, F>) => FTypes.SetResult<F>
}

const buildInteractor = <F extends FTypes.FirestoreApp>(
  FieldValue: FTypes.FieldValueClass<F>,
) => {
  const withMeta = WithMeta(FieldValue)

  return {
    create: (docRef: FTypes.DocumentRef<any, F>, data: any) => {
      const dataT = withMeta.toCreate(data)
      return docRef.set(dataT as any, {})
    },
    setMerge: (docRef: FTypes.DocumentRef<any, F>, data: any) => {
      const dataT = withMeta.toUpdate(data)
      return docRef.set(dataT as any, _mergeOptions)
    },
    update: (docRef: FTypes.DocumentRef<any, F>, data: any) => {
      const dataT = withMeta.toUpdate(data)
      return docRef.update(dataT as any)
    },
    delete: (docRef: FTypes.DocumentRef<any, F>) => docRef.delete(),
  } as Interactor<F>
}

/**
 * TransactionController
 */
export type TransactionController<F extends FTypes.FirestoreApp> = {
  get: <T>(
    docRef: FTypes.DocumentRef<T, F>,
  ) => Promise<FTypes.DocumentSnap<T, F>>

  create: <U extends UnknownT>(
    docRef: FTypes.DocumentRef<U, F>,
    data: ToCreate<U, F>,
  ) => void

  setMerge: <U extends UnknownT>(
    docRef: FTypes.DocumentRef<U, F>,
    data: ToUpdate<U, F>,
  ) => void

  update: <U extends UnknownT>(
    docRef: FTypes.DocumentRef<U, F>,
    data: ToUpdate<U, F>,
  ) => void

  delete: (docRef: FTypes.DocumentRef<any, F>) => void
}

const buildTransactionController = <F extends FTypes.FirestoreApp>(
  FieldValue: FTypes.FieldValueClass<F>,
) => {
  const withMeta = WithMeta(FieldValue)

  return (tx: FTypes.Transaction<F>) => {
    const _tx = tx as _web.Transaction
    return {
      get: (docRef: FTypes.DocumentRef<any, F>) => {
        return _tx.get(docRef as any) as any
      },
      create: (docRef: FTypes.DocumentRef<any, F>, data: any) => {
        const dataT = withMeta.toCreate(data)
        return _tx.set(docRef as any, dataT as any)
      },
      setMerge: (docRef: FTypes.DocumentRef<any, F>, data: any) => {
        const dataT = withMeta.toUpdate(data)
        return _tx.set(docRef as any, dataT as any, _mergeOptions)
      },
      update: (docRef: FTypes.DocumentRef<any, F>, data: any) => {
        const dataT = withMeta.toUpdate(data)
        return _tx.update(docRef as any, dataT as any)
      },
      delete: (docRef: FTypes.DocumentRef<any, F>) =>
        _tx.delete((docRef as unknown) as _web.DocumentReference<any>),
    } as TransactionController<F>
  }
}

export type RunTransactionFn<F extends FTypes.FirestoreApp> = <R>(
  fn: (tc: TransactionController<F>, _tx: FTypes.Transaction<F>) => Promise<R>,
) => Promise<R>

/**
 * all
 */
export type FirestoreWriteAdapter<F extends FTypes.FirestoreApp> = {
  FieldValue: FTypes.FieldValueClass<F>
  Timestamp: FTypes.TimestampClass<F>
} & Interactor<F> & {
    runTransaction: RunTransactionFn<F>
  }

export const createFirestoreWriteAdapter = <F extends FTypes.FirestoreApp>(
  { FieldValue, Timestamp }: typeof _web | typeof _admin,
  app: F,
) => {
  const interactor = buildInteractor<F>(FieldValue as any)
  const TransactionController = buildTransactionController<F>(FieldValue as any)

  const runTransaction = <R>(
    fn: (
      tc: TransactionController<F>,
      _tx: FTypes.Transaction<F>,
    ) => Promise<R>,
  ) => {
    return (app as _web.Firestore).runTransaction(async (tx) => {
      const txf = tx as FTypes.Transaction<F>
      const tc = TransactionController(txf)
      return fn(tc, txf)
    })
  }

  return {
    FieldValue,
    Timestamp,
    ...interactor,
    runTransaction,
  } as FirestoreWriteAdapter<F>
}
