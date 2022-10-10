'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.DocDataHelper = exports.docAsAdmin = exports.docAsWeb = void 0
const type_js_1 = require('../../../lib/type.js')
const index_js_1 = require('../../constants/index.js')
const docAsWeb = (ref) => {
  return ref
}
exports.docAsWeb = docAsWeb
const docAsAdmin = (ref) => {
  return ref
}
exports.docAsAdmin = docAsAdmin
class DocDataHelper {
  constructor(firestoreStatic) {
    Object.defineProperty(this, 'firestoreStatic', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: firestoreStatic,
    })
    Object.defineProperty(this, 'mergeOptions', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: { merge: true },
    })
  }
  toCreate(data) {
    return {
      ...data,
      [index_js_1._createdAt]: this.firestoreStatic.serverTimestamp(),
      [index_js_1._updatedAt]: this.firestoreStatic.serverTimestamp(),
    }
  }
  toUpdate(data) {
    return {
      ...data,
      [index_js_1._updatedAt]: this.firestoreStatic.serverTimestamp(),
    }
  }
  dataOf(dataOrFn) {
    return type_js_1.is.function_(dataOrFn)
      ? dataOrFn(this.firestoreStatic)
      : dataOrFn
  }
  create(dataOrFn) {
    return [this.toCreate(this.dataOf(dataOrFn))]
  }
  setMerge(dataOrFn) {
    return [this.toUpdate(this.dataOf(dataOrFn)), this.mergeOptions]
  }
  update(dataOrFn) {
    return [this.toUpdate(this.dataOf(dataOrFn))]
  }
}
exports.DocDataHelper = DocDataHelper
