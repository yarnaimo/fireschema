import { TypedCollectionRef } from './TypedCollectionRef.js';
import { TypedFDBase } from './TypedFDBase.js';
import { deleteDocUniv, existsUniv, getDocUniv, setDocUniv, updateDocUniv, } from './_universal.js';
import { DocDataHelper } from './_utils.js';
export class DocumentNotExistsError extends Error {
}
export const withRefTransformer = (data, snap) => ({ ...data, ref: snap.ref });
export class TypedDocumentSnap {
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
        Object.defineProperty(this, "ref", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = raw.id;
        this.ref = new TypedDocumentRef(this.options, raw.ref);
    }
    exists() {
        return existsUniv(this.raw);
    }
    data({ snapshotOptions, transformer, } = {}) {
        var _a;
        const data = this.raw.data(snapshotOptions);
        if (!data) {
            return undefined;
        }
        return (_a = transformer === null || transformer === void 0 ? void 0 : transformer(data, this)) !== null && _a !== void 0 ? _a : data;
    }
}
export class TypedQueryDocumentSnap extends TypedDocumentSnap {
    constructor(options, raw) {
        super(options, raw);
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
    data({ snapshotOptions, transformer, } = {}) {
        var _a;
        const data = this.raw.data(snapshotOptions);
        return (_a = transformer === null || transformer === void 0 ? void 0 : transformer(data, this)) !== null && _a !== void 0 ? _a : data;
    }
}
export class TypedDocumentRef extends TypedFDBase {
    constructor(options, raw) {
        super(options, raw);
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
        Object.defineProperty(this, "dataHelper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new DocDataHelper(this.options.firestoreStatic)
        });
        this.id = raw.id;
        this.path = raw.path;
    }
    wrapWriteResult(writeResult) {
        return writeResult;
    }
    parentCollection() {
        return new TypedCollectionRef(this.options, this.raw.parent, true);
    }
    async get({ from } = {}) {
        const snap = await getDocUniv(this.raw, from);
        return new TypedDocumentSnap(this.options, snap);
    }
    async getData({ from, ...dataOptions } = {}) {
        const typedSnap = await this.get({ from });
        return typedSnap.data(dataOptions);
    }
    async getDataOrThrow(options = {}) {
        const data = await this.getData(options);
        if (!data) {
            throw new DocumentNotExistsError(`Document ${this.path} not exists`);
        }
        return data;
    }
    async create(dataOrFn) {
        const args = this.dataHelper.create(dataOrFn);
        return this.wrapWriteResult('create' in this.raw
            ? await this.raw.create(...args)
            : await setDocUniv(this.raw, ...args));
    }
    async setMerge(dataOrFn) {
        return this.wrapWriteResult(await setDocUniv(this.raw, ...this.dataHelper.setMerge(dataOrFn)));
    }
    async update(dataOrFn) {
        return this.wrapWriteResult(await updateDocUniv(this.raw, ...this.dataHelper.update(dataOrFn)));
    }
    async delete() {
        return this.wrapWriteResult(await deleteDocUniv(this.raw));
    }
}
