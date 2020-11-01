import { FTypes } from '../../types/FTypes'
import { fadmin, fweb } from '../../types/_firestore'
import { GetDeep, Loc } from '../../types/_object'
import { getDeep } from '../../utils/_object'
import { $adapter, $schema, _createdAt, _updatedAt } from '../constants'
import { $collectionAdapter } from '../factories'
import { STypes } from '../STypes'

const getLoc = (parentOrRoot: FTypes.DocumentRef<unknown>) =>
  parentOrRoot.path.split('/').filter((_, i) => i % 2 === 0)

type GetDocT<
  D extends 'root' | FTypes.DocumentRef<unknown>
> = D extends FTypes.DocumentRef<infer T> ? T : never

type GetSchemaU<
  C extends STypes.CollectionOptions.Meta,
  CS = C[typeof $schema]
> = CS extends STypes.DocumentSchema<any> ? CS['__U__'] : never

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
    $collectionAdapter()({})(collectionRef)

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
> = SchemaUWithLoc<EnsureOptions<_C>, L>

type Parent = 'root' | FTypes.DocumentRef<STypes.HasLoc<string[]>>

type EnsureOptions<_C> = _C extends STypes.CollectionOptions.Meta ? _C : never

type GetL<P extends Parent, N> = [...GetPL<P>, N]
type GetPL<P extends Parent> = P extends 'root' ? [] : GetDocT<P>['__loc__']

type GetSL<
  C extends STypes.CollectionOptions.Meta
> = C[typeof $adapter] extends null
  ? {}
  : NonNullable<C[typeof $adapter]>['__SL__']

type SchemaUWithLoc<
  C extends STypes.CollectionOptions.Meta,
  L extends string[]
> = GetSchemaU<C> & STypes.HasLoc<L> & STypes.HasT<C[typeof $schema]['__T__']>

type CollectionController<
  F extends FTypes.FirestoreApp,
  S extends STypes.RootOptions.All
> = {
  collection: <
    P extends Parent,
    N extends keyof PC & string,
    PC = GetDeep<S, GetPL<P>>,
    _C = PC[N]
  >(
    parent: P,
    collectionName: N,
  ) => {
    ref: FTypes.CollectionRef<
      STypes.DocumentMeta<F> & SchemaUWithLoc<EnsureOptions<_C>, GetL<P, N>>,
      F
    >
    select: STypes.Selectors<GetL<P, N>, GetSL<EnsureOptions<_C>>, F>
    doc: (
      id?: string,
    ) => FTypes.DocumentRef<
      STypes.DocumentMeta<F> & SchemaUWithLoc<EnsureOptions<_C>, GetL<P, N>>,
      F
    >
  }

  documentByPath: <L extends Loc<S>, _C = GetDeep<S, L>>(
    loc: L,
    path: string,
  ) => FTypes.DocumentRef<
    STypes.DocumentMeta<F> & SchemaUWithLoc<EnsureOptions<_C>, L>,
    F
  >

  collectionGroup: <L extends Loc<S>, _C = GetDeep<S, L>>(
    loc: L,
  ) => {
    query: FTypes.Query<
      STypes.DocumentMeta<F> & SchemaUWithLoc<EnsureOptions<_C>, L>,
      F
    >
    select: STypes.Selectors<L, GetSL<EnsureOptions<_C>>, F>
  }
}

const createConverter = (decoder: STypes.Decoder<any, any>) => ({
  fromFirestore: decoder,
  toFirestore: (data: any) => data,
})

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
  const { decoder } = collectionOptions[$schema]

  const rawCollectionRef = appOrParent.collection(collectionName)

  type CR = FTypes.CollectionRef<
    STypes.DocumentMeta<F> & SchemaUWithLoc<C, L>,
    F
  >
  const collectionRef = (decoder
    ? (rawCollectionRef.withConverter as any)(createConverter(decoder))
    : rawCollectionRef) as CR

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

    const doc = (id?: string) => collectionRef.doc(...(id ? [id] : []))

    return { ref: collectionRef, select, doc }
  }) as CollectionController<F, S>['collection']

  const documentByPath = (<L extends Loc<S>, _C = GetDeep<S, L>>(
    loc: L,
    path: string,
  ) => {
    type C = EnsureOptions<_C>

    const docRef = app.doc(path) as FTypes.DocumentRef<
      STypes.DocumentMeta<F> & SchemaUWithLoc<C, L>,
      F
    >

    return docRef
  }) as CollectionController<F, S>['documentByPath']

  const collectionGroup: CollectionController<F, S>['collectionGroup'] = <
    L extends Loc<S>,
    _C = GetDeep<S, L>
  >(
    loc: L,
  ) => {
    type C = EnsureOptions<_C>

    const collectionId = loc[loc.length - 1]
    const collectionOptions = (getDeep(schemaOptions, loc) as unknown) as C
    const { decoder } = collectionOptions[$schema]

    const rawQuery = app.collectionGroup(collectionId)

    type Q = FTypes.Query<STypes.DocumentMeta<F> & SchemaUWithLoc<C, L>, F>
    const query = (decoder
      ? (rawQuery.withConverter as any)(createConverter(decoder))
      : rawQuery) as Q

    const { select } = getAdapted<F, L, C>(collectionOptions, query)

    return { query, select }
  }

  return { collection, documentByPath, collectionGroup }
}

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

const _mergeOption = { merge: true }

export type Interactor<F extends FTypes.FirestoreApp> = {
  create: <U extends STypes.HasT<unknown>>(
    docRef: FTypes.DocumentRef<U, F>,
    data: DataToCreate<U, F>,
  ) => FTypes.SetResult<F>
  setMerge: <U extends STypes.HasT<unknown>>(
    docRef: FTypes.DocumentRef<U, F>,
    data: DataToUpdate<U, F>,
  ) => FTypes.SetResult<F>
  update: <U extends STypes.HasT<unknown>>(
    docRef: FTypes.DocumentRef<U, F>,
    data: DataToUpdate<U, F>,
  ) => FTypes.SetResult<F>
  delete: (docRef: FTypes.DocumentRef<any, F>) => FTypes.SetResult<F>
}

export type TransactionController<F extends FTypes.FirestoreApp> = {
  get: <T>(
    docRef: FTypes.DocumentRef<T, F>,
  ) => Promise<FTypes.DocumentSnap<T, F>>
  create: <U extends STypes.HasT<unknown>>(
    docRef: FTypes.DocumentRef<U, F>,
    data: DataToCreate<U, F>,
  ) => void
  setMerge: <U extends STypes.HasT<unknown>>(
    docRef: FTypes.DocumentRef<U, F>,
    data: DataToUpdate<U, F>,
  ) => void
  update: <U extends STypes.HasT<unknown>>(
    docRef: FTypes.DocumentRef<U, F>,
    data: DataToUpdate<U, F>,
  ) => void
  delete: (docRef: FTypes.DocumentRef<any, F>) => void
}

type DataToCreate<
  U extends STypes.HasT<unknown>,
  F extends FTypes.FirestoreApp
> = STypes.DocDataToWrite<U['__T__'], F>
type DataToUpdate<
  U extends STypes.HasT<unknown>,
  F extends FTypes.FirestoreApp
> = Partial<DataToCreate<U, F>>

const buildInteractor = <F extends FTypes.FirestoreApp>(
  FieldValue: FTypes.FieldValueClass<F>,
): Interactor<F> => {
  const withMeta = WithMeta(FieldValue)

  return {
    create: <U extends STypes.HasT<unknown>>(
      docRef: FTypes.DocumentRef<U, F>,
      data: DataToCreate<U, F>,
    ) => {
      const dataT = withMeta.toCreate<U>(data)
      return docRef.set(dataT as any, {}) as FTypes.SetResult<F>
    },

    setMerge: <U extends STypes.HasT<unknown>>(
      docRef: FTypes.DocumentRef<U, F>,
      data: DataToUpdate<U, F>,
    ) => {
      const dataT = withMeta.toUpdate<U>(data)
      return docRef.set(dataT as any, _mergeOption) as FTypes.SetResult<F>
    },

    update: <U extends STypes.HasT<unknown>>(
      docRef: FTypes.DocumentRef<U, F>,
      data: DataToUpdate<U, F>,
    ) => {
      const dataT = withMeta.toUpdate<U>(data)
      return docRef.update(dataT as any) as FTypes.SetResult<F>
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

      create: <U extends STypes.HasT<unknown>>(
        docRef: FTypes.DocumentRef<U, F>,
        data: DataToCreate<U, F>,
      ) => {
        const dataT = withMeta.toCreate<U>(data)
        return _tx.set(
          (docRef as unknown) as fweb.DocumentReference<U>,
          dataT as any,
        )
      },

      setMerge: <U extends STypes.HasT<unknown>>(
        docRef: FTypes.DocumentRef<U, F>,
        data: DataToUpdate<U, F>,
      ) => {
        const dataT = withMeta.toUpdate<U>(data)
        return _tx.set(
          (docRef as unknown) as fweb.DocumentReference<U>,
          dataT as any,
          _mergeOption,
        )
      },

      update: <U extends STypes.HasT<unknown>>(
        docRef: FTypes.DocumentRef<U, F>,
        data: DataToUpdate<U, F>,
      ) => {
        const dataT = withMeta.toUpdate<U>(data)
        return _tx.update(
          (docRef as unknown) as fweb.DocumentReference<U>,
          dataT as any,
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

  const {
    collection,
    documentByPath,
    collectionGroup,
  } = buildCollectionController(app, schemaOptions)

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
    documentByPath,
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
