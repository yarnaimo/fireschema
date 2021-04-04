import { P } from 'lifts'
import { R } from '../../../lib/fp'
import { $schema } from '../../constants'
import { FTypes, STypes, STypeUtils } from '../../types'
import { ParseCollectionPath } from '../../types/_firestore'
import { GetDeep } from '../../types/_object'
import {
  childLoc,
  createConverter,
  firestorePathToLoc,
  getCollectionOptions,
} from '../../utils/_firestore'
import { addQueryCache, findCachedQuery } from './_query-cache'

type SRoot = STypes.RootOptions.All

const selected = (
  schema: STypes.CollectionSchema<any, any, any>,
  selector: STypes.Select<any, any, any>,
) => (query: FTypes.Query<unknown>) => {
  const selectorsObject = schema.selectors(query)

  return selector(selectorsObject)
}

const decoded = (
  schema: STypes.CollectionSchema<any, any, any>,
  collectionName: string,
) => (rawQuery: FTypes.Query<any>) => {
  const { decoder } = schema

  const cachedQuery = findCachedQuery(collectionName, rawQuery)
  if (cachedQuery) {
    return cachedQuery
  }

  const convertedQuery = (rawQuery.withConverter as any)(
    createConverter(decoder),
  )

  addQueryCache(collectionName, rawQuery, convertedQuery)

  return convertedQuery
}

/**
 * Collection
 */
type CollectionFn<S extends SRoot> = <
  P extends STypeUtils.Parent<FTypes.FirestoreApp>,
  N extends Extract<keyof PC, string>,
  PC = GetDeep<S, STypeUtils.GetPL<P>>,
  _C = PC[N],
  F extends STypeUtils.GetFFromParent<P> = STypeUtils.GetFFromParent<P>
>(
  parent: P,
  collectionName: N,
) => FTypes.CollectionRef<
  STypeUtils.DocDataFromOptions<F, _C, STypeUtils.GetL<P, N>>,
  F
>

const Collection = <S extends SRoot>(schemaOptions: S) =>
  ((parent: STypeUtils.Parent, collectionName: string) => {
    const loc = childLoc(parent, collectionName)
    const collectionOptions = getCollectionOptions(schemaOptions, loc)

    return P(
      parent.collection(collectionName),
      decoded(collectionOptions[$schema], collectionName),
    )
  }) as CollectionFn<S>

/**
 * CollectionQuery
 */
type CollectionQueryFn<S extends SRoot> = <
  P extends STypeUtils.Parent<FTypes.FirestoreApp>,
  N extends Extract<keyof PC, string>,
  PC = GetDeep<S, STypeUtils.GetPL<P>>,
  _C = PC[N],
  F extends STypeUtils.GetFFromParent<P> = STypeUtils.GetFFromParent<P>
>(
  parent: P,
  collectionName: N,
  selector: STypes.Select<F, STypeUtils.GetL<P, N>, _C>,
) => FTypes.Query<
  STypeUtils.DocDataFromOptions<F, _C, STypeUtils.GetL<P, N>>,
  F
>

const CollectionQuery = <S extends SRoot>(schemaOptions: S) =>
  ((
    parent: STypeUtils.Parent,
    collectionName: string,
    selector: STypes.Select<any, any, any>,
  ) => {
    const loc = childLoc(parent, collectionName)
    const collectionOptions = getCollectionOptions(schemaOptions, loc)

    return P(
      parent.collection(collectionName),
      decoded(collectionOptions[$schema], collectionName),
      selected(collectionOptions[$schema], selector),
    )
  }) as CollectionQueryFn<S>

/**
 * CollectionGroup
 */
type CollectionGroupFn<S extends SRoot> = <
  F extends FTypes.FirestoreApp,
  CP extends string,
  L extends string[] = ParseCollectionPath<CP>,
  _C = GetDeep<S, L>
>(
  root: F,
  collectionPath: CP,
) => FTypes.Query<STypeUtils.DocDataFromOptions<F, _C, L>, F>

const CollectionGroup = <S extends SRoot>(schemaOptions: S) =>
  ((app: FTypes.FirestoreApp, collectionPath: string) => {
    const loc = firestorePathToLoc(collectionPath)
    const collectionName = R.last(loc)!
    const collectionOptions = getCollectionOptions(schemaOptions, loc)

    return P(
      app.collectionGroup(collectionName),
      decoded(collectionOptions[$schema], collectionName),
    )
  }) as CollectionGroupFn<S>

/**
 * CollectionGroupQuery
 */
type CollectionGroupQueryFn<S extends SRoot> = <
  F extends FTypes.FirestoreApp,
  CP extends string,
  L extends string[] = ParseCollectionPath<CP>,
  _C = GetDeep<S, L>
>(
  root: F,
  collectionPath: CP,
  selector: STypes.Select<F, L, _C>,
) => FTypes.Query<STypeUtils.DocDataFromOptions<F, _C, L>, F>

const CollectionGroupQuery = <S extends SRoot>(schemaOptions: S) =>
  ((
    app: FTypes.FirestoreApp,
    collectionPath: string,
    selector: STypes.Select<any, any, any>,
  ) => {
    const loc = firestorePathToLoc(collectionPath)
    const collectionName = R.last(loc)!
    const collectionOptions = getCollectionOptions(schemaOptions, loc)

    return P(
      app.collectionGroup(collectionName),
      decoded(collectionOptions[$schema], collectionName),
      selected(collectionOptions[$schema], selector),
    )
  }) as CollectionGroupFn<S>

/**
 * TypeDocument
 */
type TypeDocumentFn<S extends SRoot> = <
  CP extends string,
  DR extends FTypes.DocumentRef<any>,
  L extends string[] = ParseCollectionPath<CP>,
  _C = GetDeep<S, L>,
  F extends FTypes.FirestoreApp = STypeUtils.GetFFromDocumentRef<DR>
>(
  collectionPath: CP,
  docRef: DR,
) => FTypes.DocumentRef<STypeUtils.DocDataFromOptions<F, _C, L>, F>

const TypeDocument = <S extends SRoot>(schemaOptions: S) =>
  ((collectionPath: string, docRef: FTypes.DocumentRef<any>) => {
    return docRef
  }) as TypeDocumentFn<S>

/**
 * GetParentDocumentRef
 */
type GetParentDocumentRefFn<S extends SRoot> = <
  CR extends FTypes.CollectionRef<STypes.HasLoc<string[]>>,
  F extends FTypes.FirestoreApp = STypeUtils.GetFFromCollectionRef<CR>,
  L extends string[] = STypeUtils.OmitLast<
    STypeUtils.GetCollectionT<CR>['__loc__']
  >,
  _C = GetDeep<S, L>
>(
  collectionRef: CR,
) => FTypes.DocumentRef<STypeUtils.DocDataFromOptions<F, _C, L>, F>

const GetParentDocumentRef = <S extends SRoot>(schemaOptions: S) =>
  ((collectionRef: FTypes.CollectionRef<any>) => {
    return collectionRef.parent
  }) as GetParentDocumentRefFn<S>

/**
 * all
 */
export type FirestoreRefAdapter<S extends SRoot> = {
  collection: CollectionFn<S>
  collectionQuery: CollectionQueryFn<S>
  collectionGroup: CollectionGroupFn<S>
  collectionGroupQuery: CollectionGroupQueryFn<S>

  typeDocument: TypeDocumentFn<S>
  getParentDocumentRef: GetParentDocumentRefFn<S>
}

export const createFirestoreRefAdapter = <S extends SRoot>(
  schemaOptions: S,
): FirestoreRefAdapter<S> => {
  return {
    collection: Collection(schemaOptions),
    collectionQuery: CollectionQuery(schemaOptions),
    collectionGroup: CollectionGroup(schemaOptions),
    collectionGroupQuery: CollectionGroupQuery(schemaOptions),

    typeDocument: TypeDocument(schemaOptions),
    getParentDocumentRef: GetParentDocumentRef(schemaOptions),
  }
}
