"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedFirestoreWeb = exports.TypedFirestoreUniv = void 0;
const _firestore_js_1 = require("../../utils/_firestore.js");
const _object_js_1 = require("../../utils/_object.js");
const TypedCollectionRef_js_1 = require("./TypedCollectionRef.js");
const TypedDocumentRef_js_1 = require("./TypedDocumentRef.js");
const TypedFDBase_js_1 = require("./TypedFDBase.js");
const TypedTransaction_js_1 = require("./TypedTransaction.js");
const TypedWriteBatch_js_1 = require("./TypedWriteBatch.js");
const _static_js_1 = require("./_static.js");
const _universal_js_1 = require("./_universal.js");
class TypedFirestoreUniv extends TypedFDBase_js_1.TypedFDBase {
    constructor(model, firestoreStatic, raw) {
        super({
            schemaOptions: model.schemaOptions,
            firestoreStatic,
            loc: '',
        }, raw);
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: model
        });
        Object.defineProperty(this, "firestoreStatic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: firestoreStatic
        });
        Object.defineProperty(this, "raw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: raw
        });
    }
    origGroup(collectionName) {
        return (0, _universal_js_1.collectionGroupUniv)(this.raw, collectionName);
    }
    collectionGroup(collectionName) {
        const collectionOptionsList = (0, _object_js_1.getCollectionOptionsByName)(this.options.schemaOptions, collectionName);
        if (collectionOptionsList.length >= 2) {
            throw new Error('If there are multiple collections with the same name in the model, they cannot be referenced by collectionGroup.');
        }
        const loc = collectionOptionsList[0].loc;
        return new TypedCollectionRef_js_1.TypedSelectable({ ...this.options, loc }, this.origGroup(collectionName));
    }
    // TODO: docref に L がない場合
    // wrapDocument<L extends string[]>(
    //   raw: FTypes.DocumentRef<any, F>,
    // ): TypedDocumentRef<S, F, L>
    wrapDocument(rawDocRef) {
        const loc = (0, _firestore_js_1.firestorePathToLoc)(rawDocRef.path);
        return new TypedDocumentRef_js_1.TypedDocumentRef({ ...this.options, loc }, rawDocRef);
    }
    async runTransaction(fn) {
        return (0, _universal_js_1.runTransactionUniv)(this.raw, async (_t) => {
            const tt = new TypedTransaction_js_1.TypedTransaction(this.options, _t);
            return fn(tt);
        });
    }
    batch() {
        return new TypedWriteBatch_js_1.TypedWriteBatch(this.options.firestoreStatic, (0, _universal_js_1.writeBatchUniv)(this.raw));
    }
}
exports.TypedFirestoreUniv = TypedFirestoreUniv;
class TypedFirestoreWeb extends TypedFirestoreUniv {
    constructor(model, raw) {
        super(model, _static_js_1.firestoreStaticWeb, raw);
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: model
        });
        Object.defineProperty(this, "raw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: raw
        });
    }
}
exports.TypedFirestoreWeb = TypedFirestoreWeb;
