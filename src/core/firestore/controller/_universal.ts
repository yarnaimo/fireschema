import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Query,
  QueryConstraint,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  query,
  queryEqual,
  refEqual,
  runTransaction,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'

import { FTypes } from '../../types/index.js'
import {
  QueryBuilder,
  QueryConstraintAdmin,
  QueryConstraintUniv,
  queryAdmin,
  queryBuilderAdmin,
  queryBuilderWeb,
} from './_query.js'

export const collectionUniv = (
  raw: FTypes.FirestoreApp | FTypes.DocumentRef<any>,
  collectionName: string,
) => {
  return raw instanceof Firestore
    ? collection(raw, collectionName)
    : raw instanceof DocumentReference
    ? collection(raw, collectionName)
    : raw.collection(collectionName)
}

export const collectionGroupUniv = (
  raw: FTypes.FirestoreApp,
  collectionName: string,
) => {
  return raw instanceof Firestore
    ? collectionGroup(raw, collectionName)
    : raw.collectionGroup(collectionName)
}

export const runTransactionUniv = async <T>(
  raw: FTypes.FirestoreApp,
  fn: (transaction: FTypes.Transaction<FTypes.FirestoreApp>) => Promise<T>,
) => {
  return raw instanceof Firestore
    ? runTransaction(raw, fn)
    : raw.runTransaction(fn)
}

export const writeBatchUniv = (raw: FTypes.FirestoreApp) => {
  return raw instanceof Firestore ? writeBatch(raw) : raw.batch()
}

export const docUniv = (
  raw: FTypes.CollectionRef<any>,
  _id: string | undefined,
) => {
  const idArgs = _id ? [_id] : []

  return raw instanceof CollectionReference
    ? doc(raw, ...idArgs)
    : raw.doc(...(idArgs as [any]))
}

export const docFromRootUniv = (raw: FTypes.FirestoreApp, id: string) => {
  return raw instanceof Firestore ? doc(raw, id) : raw.doc(id)
}

export const existsUniv = (raw: FTypes.DocumentSnap<any>): boolean => {
  return raw instanceof DocumentSnapshot ? raw.exists() : raw.exists
}

export const setDocUniv = async (
  raw: FTypes.DocumentRef<any>,
  ...args: any[]
) => {
  return raw instanceof DocumentReference
    ? setDoc(raw, ...(args as [any]))
    : raw.set(...(args as [any]))
}

export const updateDocUniv = async (
  raw: FTypes.DocumentRef<any>,
  data: any,
) => {
  return raw instanceof DocumentReference
    ? updateDoc(raw, data)
    : raw.update(data)
}

export const deleteDocUniv = async (raw: FTypes.DocumentRef<any>) => {
  return raw instanceof DocumentReference ? deleteDoc(raw) : raw.delete()
}

export type GetSource = 'server' | 'cache' | undefined

const getDocWeb = (from: GetSource) => {
  return from === 'cache'
    ? getDocFromCache
    : from === 'server'
    ? getDocFromServer
    : getDoc
}

const getDocsWeb = (from: GetSource) => {
  return from === 'cache'
    ? getDocsFromCache
    : from === 'server'
    ? getDocsFromServer
    : getDocs
}

export const getDocUniv = async (
  raw: FTypes.DocumentRef<any>,
  from: GetSource,
) => {
  return raw instanceof DocumentReference ? getDocWeb(from)(raw) : raw.get()
}

export const getDocsUniv = async (raw: FTypes.Query<any>, from: GetSource) => {
  return raw instanceof Query ? getDocsWeb(from)(raw) : raw.get()
}

export const queryUniv = (
  raw: FTypes.Query<any>,
  constraints: QueryConstraintUniv[],
) => {
  if (raw instanceof Query) {
    return query(raw, ...(constraints as QueryConstraint[]))
  } else {
    return queryAdmin(raw, ...(constraints as QueryConstraintAdmin[]))
  }
}

export const queryBuilderUniv = (raw: FTypes.Query<any>) => {
  return raw instanceof Query || raw instanceof CollectionReference
    ? queryBuilderWeb
    : (queryBuilderAdmin as unknown as QueryBuilder<string>)
}

export const buildQueryUniv = (
  raw: FTypes.Query<any>,
  fn: (q: QueryBuilder<string>) => QueryConstraintUniv[],
) => {
  const constraints = fn(queryBuilderUniv(raw))
  return queryUniv(raw, constraints)
}

export const refEqualUniv = <
  T extends FTypes.DocumentRef<any> | FTypes.CollectionRef<any>,
>(
  left: T,
  right: T,
) => {
  return left instanceof DocumentReference ||
    left instanceof CollectionReference
    ? refEqual(left, right as any)
    : left.isEqual(right as any)
}

export const queryEqualUniv = (
  left: FTypes.Query<any>,
  right: FTypes.Query<any>,
) => {
  return left instanceof Query
    ? queryEqual(left, right as any)
    : left.isEqual(right as any)
}
