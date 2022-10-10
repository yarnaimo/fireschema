"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedCollectionRef = exports.TypedSelectable = exports.TypedQueryRef = exports.TypedQuerySnap = void 0;
const _object_js_1 = require("../../utils/_object.js");
const TypedDocumentRef_js_1 = require("./TypedDocumentRef.js");
const _query_cache_js_1 = require("./_query-cache.js");
const _universal_js_1 = require("./_universal.js");
class TypedQuerySnap {
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
            return new TypedDocumentRef_js_1.TypedQueryDocumentSnap(options, rawDocSnap);
        });
    }
}
exports.TypedQuerySnap = TypedQuerySnap;
class TypedQueryRef {
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
        const name = (0, _object_js_1.getLastSegment)(options.loc);
        this.collectionOptions = (0, _object_js_1.getSchemaOptionsByLoc)(options.schemaOptions, options.loc);
        const convertedQuery = skipDecoder
            ? origQuery
            : (0, _query_cache_js_1.withDecoder)(origQuery, this.collectionOptions.model, name);
        this.raw = convertedQuery;
    }
    async get({ from } = {}) {
        const snap = await (0, _universal_js_1.getDocsUniv)(this.raw, from);
        return new TypedQuerySnap(this.options, snap);
    }
    async getData({ from, ...dataOptions } = {}) {
        const typedSnap = await this.get({ from });
        return typedSnap.docs.map((snap) => snap.data(dataOptions));
    }
}
exports.TypedQueryRef = TypedQueryRef;
class TypedSelectable extends TypedQueryRef {
    constructor(options, origQuery, skipDecoder) {
        super(options, origQuery, skipDecoder);
        Object.defineProperty(this, "select", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const selectorsConstraint = this.collectionOptions.model.selectors((0, _universal_js_1.queryBuilderUniv)(this.raw), this.options.firestoreStatic);
        this.select = Object.fromEntries(Object.entries(selectorsConstraint).map(([k, fn]) => {
            return [
                k,
                (...args) => {
                    const queryConstraints = fn(...args);
                    const query = (0, _universal_js_1.queryUniv)(this.raw, queryConstraints);
                    return new TypedQueryRef(this.options, query, true);
                },
            ];
        }));
    }
}
exports.TypedSelectable = TypedSelectable;
class TypedCollectionRef extends TypedSelectable {
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
        const docRaw = (0, _universal_js_1.docUniv)(this.raw, id);
        return new TypedDocumentRef_js_1.TypedDocumentRef(this.options, docRaw);
    }
    parentDocument() {
        if (!this.options.loc.includes('.')) {
            return undefined;
        }
        const parentDocLoc = (0, _object_js_1.omitLastSegment)(this.options.loc);
        const origPDoc = this.raw.parent;
        const parentTypedCollection = new TypedCollectionRef({ ...this.options, loc: parentDocLoc }, origPDoc.parent);
        return parentTypedCollection.doc(origPDoc.id);
    }
}
exports.TypedCollectionRef = TypedCollectionRef;
