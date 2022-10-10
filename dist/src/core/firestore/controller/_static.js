"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirestoreStaticAdmin = exports.firestoreStaticWeb = void 0;
const firestore_1 = require("firebase/firestore");
exports.firestoreStaticWeb = {
    arrayRemove: firestore_1.arrayRemove,
    arrayUnion: firestore_1.arrayUnion,
    deleteField: firestore_1.deleteField,
    documentId: firestore_1.documentId,
    increment: firestore_1.increment,
    serverTimestamp: firestore_1.serverTimestamp,
    Timestamp: firestore_1.Timestamp,
};
const createFirestoreStaticAdmin = (raw) => {
    return {
        arrayRemove: raw.FieldValue.arrayRemove.bind(raw.FieldValue),
        arrayUnion: raw.FieldValue.arrayUnion.bind(raw.FieldValue),
        deleteField: raw.FieldValue.delete.bind(raw.FieldValue),
        documentId: raw.FieldPath.documentId.bind(raw.FieldPath),
        increment: raw.FieldValue.increment.bind(raw.FieldValue),
        serverTimestamp: raw.FieldValue.serverTimestamp.bind(raw.FieldValue),
        Timestamp: raw.Timestamp,
    };
};
exports.createFirestoreStaticAdmin = createFirestoreStaticAdmin;
