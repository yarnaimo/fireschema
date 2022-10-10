"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedTransaction = void 0;
const TypedDocumentRef_js_1 = require("./TypedDocumentRef.js");
const _utils_js_1 = require("./_utils.js");
class TypedTransaction {
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
        Object.defineProperty(this, "dataHelper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new _utils_js_1.DocDataHelper(this.options.firestoreStatic)
        });
    }
    async get(typedDoc) {
        const snap = 'create' in this.raw
            ? await this.raw.get((0, _utils_js_1.docAsAdmin)(typedDoc.raw))
            : await this.raw.get((0, _utils_js_1.docAsWeb)(typedDoc.raw));
        return new TypedDocumentRef_js_1.TypedDocumentSnap({ ...this.options, loc: typedDoc.options.loc }, snap);
    }
    async getData(typedDoc, dataOptions = {}) {
        const typedSnap = await this.get(typedDoc);
        return typedSnap.data(
        // @ts-ignore TODO:
        dataOptions);
    }
    create(typedDoc, dataOrFn) {
        const args = this.dataHelper.create(dataOrFn);
        if ('create' in this.raw) {
            this.raw.create((0, _utils_js_1.docAsAdmin)(typedDoc.raw), ...args);
        }
        else {
            this.raw.set((0, _utils_js_1.docAsWeb)(typedDoc.raw), ...args);
        }
        return this;
    }
    setMerge(typedDoc, dataOrFn) {
        const args = this.dataHelper.setMerge(dataOrFn);
        if ('create' in this.raw) {
            this.raw.set((0, _utils_js_1.docAsAdmin)(typedDoc.raw), ...args);
        }
        else {
            this.raw.set((0, _utils_js_1.docAsWeb)(typedDoc.raw), ...args);
        }
        return this;
    }
    update(typedDoc, dataOrFn) {
        const args = this.dataHelper.update(dataOrFn);
        if ('create' in this.raw) {
            this.raw.update((0, _utils_js_1.docAsAdmin)(typedDoc.raw), ...args);
        }
        else {
            this.raw.update((0, _utils_js_1.docAsWeb)(typedDoc.raw), ...args);
        }
        return this;
    }
    delete(typedDoc) {
        if ('create' in this.raw) {
            this.raw.delete((0, _utils_js_1.docAsAdmin)(typedDoc.raw));
        }
        else {
            this.raw.delete((0, _utils_js_1.docAsWeb)(typedDoc.raw));
        }
        return this;
    }
}
exports.TypedTransaction = TypedTransaction;
