"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedFirestoreTrigger = void 0;
const _firestore_js_1 = require("../../utils/_firestore.js");
const _object_js_1 = require("../../utils/_object.js");
class TypedFirestoreTrigger {
    constructor(firestoreSchema, firestoreStatic, functions) {
        Object.defineProperty(this, "firestoreSchema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: firestoreSchema
        });
        Object.defineProperty(this, "firestoreStatic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: firestoreStatic
        });
        Object.defineProperty(this, "functions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions
        });
    }
    buildDecoder(path) {
        const loc = (0, _firestore_js_1.firestorePathToLoc)(path);
        const collectionOptions = (0, _object_js_1.getSchemaOptionsByLoc)(this.firestoreSchema, loc);
        const { decoder } = collectionOptions.model;
        return (snap) => {
            const data = snap.data();
            return decoder ? decoder(data, snap) : data;
        };
    }
    buildSnapDecoder(path) {
        const decode = this.buildDecoder(path);
        return (documentSnap) => documentSnap instanceof this.firestoreStatic.QueryDocumentSnapshot
            ? decode(documentSnap)
            : undefined;
    }
    onCreate({ builder, path, handler, }) {
        const decode = this.buildDecoder(path);
        return builder.firestore.document(path).onCreate(async (snap, context) => {
            const decodedData = decode(snap);
            return handler(decodedData, snap, context);
        });
    }
    onDelete({ builder, path, handler, }) {
        const decode = this.buildDecoder(path);
        return builder.firestore.document(path).onDelete(async (snap, context) => {
            const decodedData = decode(snap);
            return handler(decodedData, snap, context);
        });
    }
    onUpdate({ builder, path, handler, }) {
        const decode = this.buildDecoder(path);
        return builder.firestore
            .document(path)
            .onUpdate(async (change, context) => {
            const decodedData = new this.functions.Change(decode(change.before), decode(change.after));
            return handler(decodedData, change, context);
        });
    }
    onWrite({ builder, path, handler, }) {
        const decode = this.buildSnapDecoder(path);
        return builder.firestore.document(path).onWrite(async (change, context) => {
            const decodedData = new this.functions.Change(decode(change.before), decode(change.after));
            return handler(decodedData, change, context);
        });
    }
}
exports.TypedFirestoreTrigger = TypedFirestoreTrigger;
