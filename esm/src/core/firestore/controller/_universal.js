import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Query,
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
import { queryAdmin, queryBuilderAdmin, queryBuilderWeb } from './_query.js'
export const collectionUniv = (raw, collectionName) => {
  return raw instanceof Firestore
    ? collection(raw, collectionName)
    : raw instanceof DocumentReference
    ? collection(raw, collectionName)
    : raw.collection(collectionName)
}
export const collectionGroupUniv = (raw, collectionName) => {
  return raw instanceof Firestore
    ? collectionGroup(raw, collectionName)
    : raw.collectionGroup(collectionName)
}
export const runTransactionUniv = async (raw, fn) => {
  return raw instanceof Firestore
    ? runTransaction(raw, fn)
    : raw.runTransaction(fn)
}
export const writeBatchUniv = (raw) => {
  return raw instanceof Firestore ? writeBatch(raw) : raw.batch()
}
export const docUniv = (raw, _id) => {
  const idArgs = _id ? [_id] : []
  return raw instanceof CollectionReference
    ? doc(raw, ...idArgs)
    : raw.doc(...idArgs)
}
export const docFromRootUniv = (raw, id) => {
  return raw instanceof Firestore ? doc(raw, id) : raw.doc(id)
}
export const existsUniv = (raw) => {
  return raw instanceof DocumentSnapshot ? raw.exists() : raw.exists
}
export const setDocUniv = async (raw, ...args) => {
  return raw instanceof DocumentReference
    ? setDoc(raw, ...args)
    : raw.set(...args)
}
export const updateDocUniv = async (raw, data) => {
  return raw instanceof DocumentReference
    ? updateDoc(raw, data)
    : raw.update(data)
}
export const deleteDocUniv = async (raw) => {
  return raw instanceof DocumentReference ? deleteDoc(raw) : raw.delete()
}
const getDocWeb = (from) => {
  return from === 'cache'
    ? getDocFromCache
    : from === 'server'
    ? getDocFromServer
    : getDoc
}
const getDocsWeb = (from) => {
  return from === 'cache'
    ? getDocsFromCache
    : from === 'server'
    ? getDocsFromServer
    : getDocs
}
export const getDocUniv = async (raw, from) => {
  return raw instanceof DocumentReference ? getDocWeb(from)(raw) : raw.get()
}
export const getDocsUniv = async (raw, from) => {
  return raw instanceof Query ? getDocsWeb(from)(raw) : raw.get()
}
export const queryUniv = (raw, constraints) => {
  if (raw instanceof Query) {
    return query(raw, ...constraints)
  } else {
    return queryAdmin(raw, ...constraints)
  }
}
export const queryBuilderUniv = (raw) => {
  return raw instanceof Query || raw instanceof CollectionReference
    ? queryBuilderWeb
    : queryBuilderAdmin
}
export const buildQueryUniv = (raw, fn) => {
  const constraints = fn(queryBuilderUniv(raw))
  return queryUniv(raw, constraints)
}
export const refEqualUniv = (left, right) => {
  return left instanceof DocumentReference ||
    left instanceof CollectionReference
    ? refEqual(left, right)
    : left.isEqual(right)
}
export const queryEqualUniv = (left, right) => {
  return left instanceof Query ? queryEqual(left, right) : left.isEqual(right)
}
