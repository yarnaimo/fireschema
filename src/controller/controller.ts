import { _createdAt, _updatedAt } from '../constants'
import { $adapter, $schema } from '../constants/symbols'
import { Fireschema } from '../types/Fireschema'
import { FTypes } from '../types/FTypes'
import { fadmin, fweb } from '../types/_firestore'
import { GetDeep, Loc } from '../types/_object'
import { getDeep } from '../utils/_object'

const getLoc = (parentOrRoot: FTypes.DocumentRef<unknown>) =>
  parentOrRoot.path.split('/').filter((_, i) => i % 2 === 0)

type GetDocT<
  D extends 'root' | FTypes.DocumentRef<unknown>
> = D extends FTypes.DocumentRef<infer T> ? T : never

type GetSchemaT<
  Options extends Fireschema.CollectionOptions.Meta,
  SOptions = Options[typeof $schema]
> = SOptions extends Fireschema.DataSchemaOptionsWithType<unknown>
  ? SOptions['__T__']
  : SOptions extends Fireschema.DataSchemaOptionsWithType<unknown>[]
  ? SOptions[number]['__T__']
  : never

const getAdapted = <
  F extends FTypes.FirestoreApp,
  Options extends Fireschema.CollectionOptions.Meta
>(
  collectionOptions: Options,
  collectionRef: FTypes.Query<any, F>,
) => {
  const adapted = collectionOptions[$adapter](collectionRef)

  const select = adapted.select as Fireschema.Selectors<
    Options[typeof $adapter]['__SL__'],
    F
  >

  return {
    select,
  }
}

export const initFirestore = <
  F extends FTypes.FirestoreApp,
  S extends Fireschema.RootOptions.All
>(
  { FieldValue, Timestamp }: FTypes.Env<F, typeof fweb, typeof fadmin>,
  app: F,
  schema: S,
) => {
  const _mergeOption = { merge: true }

  const _toCreate = <T>(data: {}) =>
    (({
      ...data,
      [_createdAt]: FieldValue.serverTimestamp(),
      [_updatedAt]: FieldValue.serverTimestamp(),
    } as any) as T)

  const _toUpdate = <T>(data: {}) =>
    (({
      ...data,
      [_updatedAt]: FieldValue.serverTimestamp(),
    } as any) as T)

  const collection = <
    P extends
      | 'root'
      | FTypes.DocumentRef<Fireschema.DocumentSchemaLoc<string[]>>,
    C extends keyof POptions & string,
    PL extends string[] = P extends 'root' ? [] : GetDocT<P>['__loc__'],
    POptions = GetDeep<S, PL>
  >(
    parent: P,
    collectionPath: C,
  ) => {
    type Options = POptions[C] extends Fireschema.CollectionOptions.Meta
      ? POptions[C]
      : never
    type L = [...PL, C]

    const appOrParent = (parent === 'root' ? app : parent) as P extends 'root'
      ? F
      : FTypes.DocumentRef<GetDocT<P>, F>

    const parentLoc = (parent === 'root' ? [] : getLoc(parent as any)) as PL

    const loc = [...parentLoc, collectionPath] as L
    const collectionOptions = (getDeep(
      schema,
      loc as any,
    ) as unknown) as Options

    const collectionRef = appOrParent.collection(
      collectionPath,
    ) as FTypes.CollectionRef<
      GetSchemaT<Options> & Fireschema.DocumentSchemaLoc<L>,
      F
    >
    const { select } = getAdapted<F, Options>(collectionOptions, collectionRef)

    return {
      ref: collectionRef,
      select,
    }
  }

  const collectionGroup = <L extends Loc<S>, _Options = GetDeep<S, L>>(
    loc: L,
  ) => {
    type Options = _Options extends Fireschema.CollectionOptions.Meta
      ? _Options
      : never

    const collectionId = loc[loc.length - 1]
    const collectionOptions = (getDeep(schema, loc) as unknown) as Options

    const query = app.collectionGroup(collectionId) as FTypes.Query<
      GetSchemaT<Options> & Fireschema.DocumentSchemaLoc<L>,
      F
    >
    const { select } = getAdapted<F, Options>(collectionOptions, query)

    return {
      query,
      select,
    }
  }

  const create = <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: Fireschema.DocDataToWrite<T, F>,
  ) => {
    const dataT = _toCreate<T>(data)
    return docRef.set(dataT, {}) as FTypes.SetResult<F>
  }

  const $create = <T>(
    transaction: FTypes.Transaction<F>,
    docRef: FTypes.DocumentRef<T, F>,
    data: Fireschema.DocDataToWrite<T, F>,
  ) => {
    const dataT = _toCreate<T>(data)
    ;(transaction as fweb.Transaction).set(docRef as any, dataT, {})
  }

  const setMerge = <T>(
    docRef: FTypes.DocumentRef<T, F>,
    data: Partial<Fireschema.DocDataToWrite<T, F>>,
  ) => {
    const dataT = _toUpdate<T>(data)
    return docRef.set(dataT, _mergeOption) as FTypes.SetResult<F>
  }

  const $setMerge = <T>(
    transaction: FTypes.Transaction<F>,
    docRef: FTypes.DocumentRef<T, F>,
    data: Partial<Fireschema.DocDataToWrite<T, F>>,
  ) => {
    const dataT = _toUpdate<T>(data)
    ;(transaction as fweb.Transaction).set(docRef as any, dataT, _mergeOption)
  }

  return {
    app,
    FieldValue,
    Timestamp,
    collection,
    collectionGroup,
    create,
    $create,
    setMerge,
    $setMerge,
  }
}
