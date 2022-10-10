'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypedWriteBatch = void 0
const _utils_js_1 = require('./_utils.js')
class TypedWriteBatch {
  constructor(firestoreStatic, raw) {
    Object.defineProperty(this, 'firestoreStatic', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: firestoreStatic,
    })
    Object.defineProperty(this, 'raw', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: raw,
    })
    Object.defineProperty(this, 'dataHelper', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new _utils_js_1.DocDataHelper(this.firestoreStatic),
    })
  }
  async commit() {
    return await this.raw.commit()
  }
  create(typedDoc, dataOrFn) {
    const args = this.dataHelper.create(dataOrFn)
    if ('create' in this.raw) {
      this.raw.create((0, _utils_js_1.docAsAdmin)(typedDoc.raw), ...args)
    } else {
      this.raw.set((0, _utils_js_1.docAsWeb)(typedDoc.raw), ...args)
    }
    return this
  }
  setMerge(typedDoc, dataOrFn) {
    const args = this.dataHelper.setMerge(dataOrFn)
    if ('create' in this.raw) {
      this.raw.set((0, _utils_js_1.docAsAdmin)(typedDoc.raw), ...args)
    } else {
      this.raw.set((0, _utils_js_1.docAsWeb)(typedDoc.raw), ...args)
    }
    return this
  }
  update(typedDoc, dataOrFn) {
    const args = this.dataHelper.update(dataOrFn)
    if ('create' in this.raw) {
      this.raw.update((0, _utils_js_1.docAsAdmin)(typedDoc.raw), ...args)
    } else {
      this.raw.update((0, _utils_js_1.docAsWeb)(typedDoc.raw), ...args)
    }
    return this
  }
  delete(typedDoc) {
    if ('create' in this.raw) {
      this.raw.delete((0, _utils_js_1.docAsAdmin)(typedDoc.raw))
    } else {
      this.raw.delete((0, _utils_js_1.docAsWeb)(typedDoc.raw))
    }
    return this
  }
}
exports.TypedWriteBatch = TypedWriteBatch
