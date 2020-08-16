import { FTypes } from '../../types/FTypes'
import { fadmin, fweb } from '../../types/_firestore'
import { GetDeep, Loc } from '../../types/_object'
import { getDeep } from '../../utils/_object'
import { $adapter, $schema, _createdAt, _updatedAt } from '../constants'
import { collectionAdapter } from '../factories'
import { STypes } from '../STypes'

const getLoc = (parentOrRoot: FTypes.DocumentRef<unknown>) =>
  parentOrRoot.path.split('/').filter((_, i) => i % 2 === 0)

type GetDocT<
  D extends 'root' | FTypes.DocumentRef<unknown>
> = D extends FTypes.DocumentRef<infer T> ? T : never

type GetSchemaT<
  C extends STypes.CollectionOptions.Meta,
  CS = C[typeof $schema]
> = CS extends STypes.DocumentSchema<any> ? CS['__T__'] : never

const getAdapted = <
  F extends FTypes.FirestoreApp,
  L extends string[],
  C extends STypes.CollectionOptions.Meta
>(
  collectionOptions: C,
  collectionRef: FTypes.Query<any, F>,
) => {
  const adapted =
    collectionOptions[$adapter]?.(collectionRef) ??
    collectionAdapter()({})(collectionRef)

  const select = adapted.select as STypes.Selectors<L, GetSL<C>, F>

  return {
    select,
  }
}

type OmitLast<T extends any[]> = T extends [
  ...(infer U extends any[] ? infer U : never),
  unknown,
]
  ? U
  : never

type GetParentT<
  S extends STypes.RootOptions.All,
  T extends STypes.HasLoc<string[]>,
  L extends string[] = OmitLast<T['__loc__']>,
  _C = GetDeep<S, L>
> = SchemaTWithLoc<EnsureOptions<_C>, L>

type Parent = 'root' | FTypes.DocumentRef<STypes.HasLoc<string[]>>

type EnsureOptions<_C> = _C extends STypes.CollectionOptions.Meta ? _C : never

type GetL<P extends Parent, N> = [...GetPL<P>, N]
type GetPL<P extends Parent> = P extends 'root' ? [] : GetDocT<P>['__loc__']

type GetSL<
  C extends STypes.CollectionOptions.Meta
> = C[typeof $adapter] extends null
  ? {}
  : NonNullable<C[typeof $adapter]>['__SL__']

type SchemaTWithLoc<
  C extends STypes.CollectionOptions.Meta,
  L extends string[]
> = GetSchemaT<C> & STypes.HasLoc<L>

type CollectionController<
  F extends FTypes.FirestoreApp,
  S extends STypes.RootOptions.All
> = {
  collection: <
    P extends Parent,
    N extends keyof PC & string,
    PC = GetDeep<S, GetPL<P>>
  >(
    parent: P,
    collectionName: N,
  ) => {
    ref: FTypes.CollectionRef<
      STypes.DocumentMeta<F> & SchemaTWithLoc<EnsureOptions<PC[N]>, GetL<P, N>>,
      F
    >
    select: STypes.Selectors<GetL<P, N>, GetSL<EnsureOptions<PC[N]>>, F>
  }
  collectionGroup: <L extends Loc<S>, _C = GetDeep<S, L>>(
    loc: L,
  ) => {
    query: FTypes.Query<
      STypes.DocumentMeta<F> & SchemaTWithLoc<EnsureOptions<_C>, L>,
      F
    >
    select: STypes.Selectors<L, GetSL<EnsureOptions<_C>>, F>
  }
}

const getCollection = <
  F extends FTypes.FirestoreApp,
  P extends Parent,
  C extends STypes.CollectionOptions.Meta,
  L extends string[]
>(
  app: F,
  parent: P,
  schemaOptions: STypes.RootOptions.All,
  collectionName: string,
) => {
  const appOrParent = (parent === 'root' ? app : parent) as P extends 'root'
    ? F
    : FTypes.DocumentRef<GetDocT<P>, F>

  const parentLoc = (parent === 'root' ? [] : getLoc(parent as any)) as GetPL<P>

  const loc = [...parentLoc, collectionName] as L
  const collectionOptions = (getDeep(schemaOptions, loc as any) as unknown) as C

  const collectionRef = appOrParent.collection(
    collectionName,
  ) as FTypes.CollectionRef<STypes.DocumentMeta<F> & SchemaTWithLoc<C, L>, F>

  return { collectionOptions, collectionRef }
}

const buildCollectionController = <
  F extends FTypes.FirestoreApp,
  S extends STypes.RootOptions.All
>(
  app: F,
  schemaOptions: S,
): CollectionController<F, S> => {
  const collection = (<
    P extends Parent,
    N extends keyof PC & string,
    PC = GetDeep<S, GetPL<P>>
  >(
    parent: P,
    collectionName: N,
  ) => {
    const { collectionOptions, collectionRef } = getCollection<
      F,
      P,
      EnsureOptions<PC[N]>,
      GetL<P, N>
    >(app, parent, schemaOptions, collectionName)

    const { select } = getAdapted<F, GetL<P, N>, EnsureOptions<PC[N]>>(
      collectionOptions,
      collectionRef,
    )

    return { ref: collectionRef, select }
  }) as CollectionController<F, S>['collection']

  const collectionGroup: CollectionController<F, S>['collectionGroup'] = <
    L extends Loc<S>,
    _C = GetDeep<S, L>
  >(
    loc: L,
  ) => {
    type C = EnsureOptions<_C>

    const collectionId = loc[loc.length - 1]
    const collectionOptions = (getDeep(schemaOptions, loc) as unknown) as C

    const query = app.collectionGroup(collectionId) as FTypes.Query<
      STypes.DocumentMeta<F> & SchemaTWithLoc<C, L>,
      F
    >
    const { select } = getAdapted<F, L, C>(collectionOptions, query)

    return { query, select }
  }

  return { collection, collectionGroup }
}

const WithMeta = (FieldValue: FTypes.FieldValueClass) => {
  return {
    toCreate: <T>(data: {}) =>
      (({
        ...data,
        [_createdAt]: FieldValue.serverTimestamp(),
        [_updatedAt]: FieldValue.serverTimestamp(),
      } as any) as T),

    toUpdate: <T>(data: {}) =>
      (({
        ...data,
        [_updatedAt]: FieldValue.serverTimestamp(),
      } as any) as T),
  }
}

const _mergeOption = { merge: true }

export type Interactor<F extends FTypes.FirestoreApp> = {
  create: <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: DataToCreate<T, F>,
  ) => FTypes.SetResult<F>
  setMerge: <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: DataToUpdate<T, F>,
  ) => FTypes.SetResult<F>
  update: <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: DataToUpdate<T, F>,
  ) => FTypes.SetResult<F>
  delete: (docRef: FTypes.DocumentRef<any, F>) => FTypes.SetResult<F>
}

export type TransactionController<F extends FTypes.FirestoreApp> = {
  get: <T>(
    docRef: FTypes.DocumentRef<T, F>,
  ) => Promise<FTypes.DocumentSnap<T, F>>
  create: <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: DataToCreate<T, F>,
  ) => void
  setMerge: <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: DataToUpdate<T, F>,
  ) => void
  update: <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: DataToUpdate<T, F>,
  ) => void
  delete: (docRef: FTypes.DocumentRef<any, F>) => void
}

type DataToCreate<T, F extends FTypes.FirestoreApp> = STypes.DocDataToWrite<
  T,
  F
>
type DataToUpdate<T, F extends FTypes.FirestoreApp> = Partial<
  DataToCreate<T, F>
>

const buildInteractor = <F extends FTypes.FirestoreApp>(
  FieldValue: FTypes.FieldValueClass<F>,
): Interactor<F> => {
  const withMeta = WithMeta(FieldValue)

  return {
    create: <T>(docRef: FTypes.DocumentRef<T, F>, data: DataToCreate<T, F>) => {
      const dataT = withMeta.toCreate<T>(data)
      return docRef.set(dataT, {}) as FTypes.SetResult<F>
    },

    setMerge: <T>(
      docRef: FTypes.DocumentRef<T, F>,
      data: DataToUpdate<T, F>,
    ) => {
      const dataT = withMeta.toUpdate<T>(data)
      return docRef.set(dataT, _mergeOption) as FTypes.SetResult<F>
    },

    update: <T>(docRef: FTypes.DocumentRef<T, F>, data: DataToUpdate<T, F>) => {
      const dataT = withMeta.toUpdate<T>(data)
      return docRef.update(dataT) as FTypes.SetResult<F>
    },

    delete: (docRef: FTypes.DocumentRef<any, F>) =>
      docRef.delete() as FTypes.SetResult<F>,
  }
}

const buildTransactionController = <F extends FTypes.FirestoreApp>(
  FieldValue: FTypes.FieldValueClass<F>,
) => {
  const withMeta = WithMeta(FieldValue)

  return (tx: FTypes.Transaction<F>): TransactionController<F> => {
    const _tx = tx as fweb.Transaction
    return {
      get: <T>(docRef: FTypes.DocumentRef<T, F>) => {
        return _tx.get(
          (docRef as unknown) as fweb.DocumentReference<T>,
        ) as Promise<FTypes.DocumentSnap<T, F>>
      },

      create: <T>(
        docRef: FTypes.DocumentRef<T, F>,
        data: DataToCreate<T, F>,
      ) => {
        const dataT = withMeta.toCreate<T>(data)
        return _tx.set((docRef as unknown) as fweb.DocumentReference<T>, dataT)
      },

      setMerge: <T>(
        docRef: FTypes.DocumentRef<T, F>,
        data: DataToUpdate<T, F>,
      ) => {
        const dataT = withMeta.toUpdate<T>(data)
        return _tx.set(
          (docRef as unknown) as fweb.DocumentReference<T>,
          dataT,
          _mergeOption,
        )
      },

      update: <T>(
        docRef: FTypes.DocumentRef<T, F>,
        data: DataToUpdate<T, F>,
      ) => {
        const dataT = withMeta.toUpdate<T>(data)
        return _tx.update(
          (docRef as unknown) as fweb.DocumentReference<T>,
          dataT,
        )
      },

      delete: (docRef: FTypes.DocumentRef<any, F>) =>
        _tx.delete((docRef as unknown) as fweb.DocumentReference<any>),
    }
  }
}

export const initFirestore = <
  F extends FTypes.FirestoreApp,
  S extends STypes.RootOptions.All
>(
  firestoreStatic: typeof fweb | typeof fadmin,
  app: F,
  schemaOptions: S,
): FirestoreController<F, S> => {
  const { FieldValue, Timestamp } = (firestoreStatic as unknown) as {
    FieldValue: FTypes.FieldValueClass<F>
    Timestamp: FTypes.TimestampClass<F>
  }

  const parentOfCollection = <T extends STypes.HasLoc<string[]>>(
    collectionRef: FTypes.CollectionRef<T, F>,
  ) => {
    return (collectionRef.parent as unknown) as FTypes.DocumentRef<
      GetParentT<S, T>,
      F
    >
  }

  const { collection, collectionGroup } = buildCollectionController(
    app,
    schemaOptions,
  )

  const interactor = buildInteractor(FieldValue)
  const TransactionController = buildTransactionController<F>(FieldValue)

  const runTransaction = <R>(
    fn: (tc: TransactionController<F>) => Promise<R>,
  ) => {
    return (app as fweb.Firestore).runTransaction(async (tx) => {
      const tc = TransactionController(tx as FTypes.Transaction<F>)
      return fn(tc)
    })
  }

  return {
    app,
    FieldValue,
    Timestamp,

    collection,
    collectionGroup,

    parentOfCollection: parentOfCollection as any,

    ...interactor,
    runTransaction,
  }
}

export type FirestoreController<
  F extends FTypes.FirestoreApp,
  S extends STypes.RootOptions.All
> = {
  app: F
  FieldValue: FTypes.FieldValueClass<F>
  Timestamp: FTypes.TimestampClass<F>

  parentOfCollection: <T extends STypes.HasLoc<string[]>>(
    collectionRef: FTypes.CollectionRef<T, F>,
  ) => FTypes.DocumentRef<GetParentT<S, T>, F>
} & CollectionController<F, S> &
  Interactor<F> & {
    runTransaction: <R>(
      fn: (tc: TransactionController<F>) => Promise<R>,
    ) => Promise<R>
  }
