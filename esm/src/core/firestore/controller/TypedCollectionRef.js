import { getLastSegment, getSchemaOptionsByLoc, omitLastSegment, } from '../../utils/_object.js';
import { TypedDocumentRef, TypedQueryDocumentSnap, } from './TypedDocumentRef.js';
import { withDecoder } from './_query-cache.js';
import { docUniv, getDocsUniv, queryBuilderUniv, queryUniv, } from './_universal.js';
export class TypedQuerySnap {
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
        Object.defineProperty(this, "docs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.docs = raw.docs.map((rawDocSnap) => {
            return new TypedQueryDocumentSnap(options, rawDocSnap);
        });
    }
}
export class TypedQueryRef {
    constructor(options, origQuery, skipDecoder) {
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
            value: void 0
        });
        Object.defineProperty(this, "collectionOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const name = getLastSegment(options.loc);
        this.collectionOptions = getSchemaOptionsByLoc(options.schemaOptions, options.loc);
        const convertedQuery = skipDecoder
            ? origQuery
            : withDecoder(origQuery, this.collectionOptions.model, name);
        this.raw = convertedQuery;
    }
    async get({ from } = {}) {
        const snap = await getDocsUniv(this.raw, from);
        return new TypedQuerySnap(this.options, snap);
    }
    async getData({ from, ...dataOptions } = {}) {
        const typedSnap = await this.get({ from });
        return typedSnap.docs.map((snap) => snap.data(dataOptions));
    }
}
export class TypedSelectable extends TypedQueryRef {
    constructor(options, origQuery, skipDecoder) {
        super(options, origQuery, skipDecoder);
        Object.defineProperty(this, "select", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const selectorsConstraint = this.collectionOptions.model.selectors(queryBuilderUniv(this.raw), this.options.firestoreStatic);
        this.select = Object.fromEntries(Object.entries(selectorsConstraint).map(([k, fn]) => {
            return [
                k,
                (...args) => {
                    const queryConstraints = fn(...args);
                    const query = queryUniv(this.raw, queryConstraints);
                    return new TypedQueryRef(this.options, query, true);
                },
            ];
        }));
    }
}
export class TypedCollectionRef extends TypedSelectable {
    constructor(options, origCollection, skipDecoder) {
        super(options, origCollection, skipDecoder);
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = this.raw.id;
        this.path = this.raw.path;
    }
    doc(id) {
        const docRaw = docUniv(this.raw, id);
        return new TypedDocumentRef(this.options, docRaw);
    }
    parentDocument() {
        if (!this.options.loc.includes('.')) {
            return undefined;
        }
        const parentDocLoc = omitLastSegment(this.options.loc);
        const origPDoc = this.raw.parent;
        const parentTypedCollection = new TypedCollectionRef({ ...this.options, loc: parentDocLoc }, origPDoc.parent);
        return parentTypedCollection.doc(origPDoc.id);
    }
}
