import { joinLoc } from '../../utils/_object.js';
import { TypedCollectionRef } from './TypedCollectionRef.js';
import { collectionUniv } from './_universal.js';
export class TypedFDBase {
    constructor(options, raw) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "raw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: raw
        });
    }
    origCollection(name) {
        return collectionUniv(this.raw, name);
    }
    collection(collectionName) {
        const loc = joinLoc(this.options.loc, collectionName);
        return new TypedCollectionRef({ ...this.options, loc }, this.origCollection(collectionName));
    }
}
