import { firestorePathToLoc } from '../../utils/_firestore.js';
import { getCollectionOptionsByName } from '../../utils/_object.js';
import { TypedSelectable } from './TypedCollectionRef.js';
import { TypedDocumentRef } from './TypedDocumentRef.js';
import { TypedFDBase } from './TypedFDBase.js';
import { TypedTransaction } from './TypedTransaction.js';
import { TypedWriteBatch } from './TypedWriteBatch.js';
import { firestoreStaticWeb } from './_static.js';
import { collectionGroupUniv, runTransactionUniv, writeBatchUniv, } from './_universal.js';
export class TypedFirestoreUniv extends TypedFDBase {
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
        return collectionGroupUniv(this.raw, collectionName);
    }
    collectionGroup(collectionName) {
        const collectionOptionsList = getCollectionOptionsByName(this.options.schemaOptions, collectionName);
        if (collectionOptionsList.length >= 2) {
            throw new Error('If there are multiple collections with the same name in the model, they cannot be referenced by collectionGroup.');
        }
        const loc = collectionOptionsList[0].loc;
        return new TypedSelectable({ ...this.options, loc }, this.origGroup(collectionName));
    }
    // TODO: docref に L がない場合
    // wrapDocument<L extends string[]>(
    //   raw: FTypes.DocumentRef<any, F>,
    // ): TypedDocumentRef<S, F, L>
    wrapDocument(rawDocRef) {
        const loc = firestorePathToLoc(rawDocRef.path);
        return new TypedDocumentRef({ ...this.options, loc }, rawDocRef);
    }
    async runTransaction(fn) {
        return runTransactionUniv(this.raw, async (_t) => {
            const tt = new TypedTransaction(this.options, _t);
            return fn(tt);
        });
    }
    batch() {
        return new TypedWriteBatch(this.options.firestoreStatic, writeBatchUniv(this.raw));
    }
}
export class TypedFirestoreWeb extends TypedFirestoreUniv {
    constructor(model, raw) {
        super(model, firestoreStaticWeb, raw);
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
