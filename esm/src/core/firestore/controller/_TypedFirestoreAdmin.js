import * as firestore from 'firebase-admin/firestore';
import { TypedFirestoreUniv } from './TypedFirestore.js';
import { createFirestoreStaticAdmin } from './_static.js';
export class TypedFirestoreAdmin extends TypedFirestoreUniv {
    constructor(model, raw) {
        super(model, createFirestoreStaticAdmin(firestore), raw);
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
