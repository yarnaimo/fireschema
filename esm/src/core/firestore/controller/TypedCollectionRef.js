import { getLastSegment, getSchemaOptionsByLoc, omitLastSegment, } from '../../utils/_object.js';
import { TypedDocumentRef, TypedQueryDocumentSnap, } from './TypedDocumentRef.js';
import { withDecoder } from './_query-cache.js';
import { docUniv, getDocsUniv, queryBuilderUniv, queryUniv, } from './_universal.js';
export class TypedQuerySnap {
    constructor(options, raw) {
        this.options = options;
        this.raw = raw;
        this.docs = raw.docs.map((rawDocSnap) => {
            return new TypedQueryDocumentSnap(options, rawDocSnap);
        });
    }
}
export class TypedQueryRef {
    constructor(options, origQuery, skipDecoder) {
        this.options = options;
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
        this.options = options;
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
