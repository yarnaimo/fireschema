"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryEqualUniv = exports.refEqualUniv = exports.buildQueryUniv = exports.queryBuilderUniv = exports.queryUniv = exports.getDocsUniv = exports.getDocUniv = exports.deleteDocUniv = exports.updateDocUniv = exports.setDocUniv = exports.existsUniv = exports.docFromRootUniv = exports.docUniv = exports.writeBatchUniv = exports.runTransactionUniv = exports.collectionGroupUniv = exports.collectionUniv = void 0;
const firestore_1 = require("firebase/firestore");
const _query_js_1 = require("./_query.js");
const collectionUniv = (raw, collectionName) => {
    return raw instanceof firestore_1.Firestore
        ? (0, firestore_1.collection)(raw, collectionName)
        : raw instanceof firestore_1.DocumentReference
            ? (0, firestore_1.collection)(raw, collectionName)
            : raw.collection(collectionName);
};
exports.collectionUniv = collectionUniv;
const collectionGroupUniv = (raw, collectionName) => {
    return raw instanceof firestore_1.Firestore
        ? (0, firestore_1.collectionGroup)(raw, collectionName)
        : raw.collectionGroup(collectionName);
};
exports.collectionGroupUniv = collectionGroupUniv;
const runTransactionUniv = async (raw, fn) => {
    return raw instanceof firestore_1.Firestore
        ? (0, firestore_1.runTransaction)(raw, fn)
        : raw.runTransaction(fn);
};
exports.runTransactionUniv = runTransactionUniv;
const writeBatchUniv = (raw) => {
    return raw instanceof firestore_1.Firestore ? (0, firestore_1.writeBatch)(raw) : raw.batch();
};
exports.writeBatchUniv = writeBatchUniv;
const docUniv = (raw, _id) => {
    const idArgs = _id ? [_id] : [];
    return raw instanceof firestore_1.CollectionReference
        ? (0, firestore_1.doc)(raw, ...idArgs)
        : raw.doc(...idArgs);
};
exports.docUniv = docUniv;
const docFromRootUniv = (raw, id) => {
    return raw instanceof firestore_1.Firestore ? (0, firestore_1.doc)(raw, id) : raw.doc(id);
};
exports.docFromRootUniv = docFromRootUniv;
const existsUniv = (raw) => {
    return raw instanceof firestore_1.DocumentSnapshot ? raw.exists() : raw.exists;
};
exports.existsUniv = existsUniv;
const setDocUniv = async (raw, ...args) => {
    return raw instanceof firestore_1.DocumentReference
        ? (0, firestore_1.setDoc)(raw, ...args)
        : raw.set(...args);
};
exports.setDocUniv = setDocUniv;
const updateDocUniv = async (raw, data) => {
    return raw instanceof firestore_1.DocumentReference
        ? (0, firestore_1.updateDoc)(raw, data)
        : raw.update(data);
};
exports.updateDocUniv = updateDocUniv;
const deleteDocUniv = async (raw) => {
    return raw instanceof firestore_1.DocumentReference ? (0, firestore_1.deleteDoc)(raw) : raw.delete();
};
exports.deleteDocUniv = deleteDocUniv;
const getDocWeb = (from) => {
    return from === 'cache'
        ? firestore_1.getDocFromCache
        : from === 'server'
            ? firestore_1.getDocFromServer
            : firestore_1.getDoc;
};
const getDocsWeb = (from) => {
    return from === 'cache'
        ? firestore_1.getDocsFromCache
        : from === 'server'
            ? firestore_1.getDocsFromServer
            : firestore_1.getDocs;
};
const getDocUniv = async (raw, from) => {
    return raw instanceof firestore_1.DocumentReference ? getDocWeb(from)(raw) : raw.get();
};
exports.getDocUniv = getDocUniv;
const getDocsUniv = async (raw, from) => {
    return raw instanceof firestore_1.Query ? getDocsWeb(from)(raw) : raw.get();
};
exports.getDocsUniv = getDocsUniv;
const queryUniv = (raw, constraints) => {
    if (raw instanceof firestore_1.Query) {
        return (0, firestore_1.query)(raw, ...constraints);
    }
    else {
        return (0, _query_js_1.queryAdmin)(raw, ...constraints);
    }
};
exports.queryUniv = queryUniv;
const queryBuilderUniv = (raw) => {
    return raw instanceof firestore_1.Query || raw instanceof firestore_1.CollectionReference
        ? _query_js_1.queryBuilderWeb
        : _query_js_1.queryBuilderAdmin;
};
exports.queryBuilderUniv = queryBuilderUniv;
const buildQueryUniv = (raw, fn) => {
    const constraints = fn((0, exports.queryBuilderUniv)(raw));
    return (0, exports.queryUniv)(raw, constraints);
};
exports.buildQueryUniv = buildQueryUniv;
const refEqualUniv = (left, right) => {
    return left instanceof firestore_1.DocumentReference ||
        left instanceof firestore_1.CollectionReference
        ? (0, firestore_1.refEqual)(left, right)
        : left.isEqual(right);
};
exports.refEqualUniv = refEqualUniv;
const queryEqualUniv = (left, right) => {
    return left instanceof firestore_1.Query
        ? (0, firestore_1.queryEqual)(left, right)
        : left.isEqual(right);
};
exports.queryEqualUniv = queryEqualUniv;
