'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypedFirestoreAdmin = void 0
const firestore = require('firebase-admin/firestore')
const TypedFirestore_js_1 = require('./TypedFirestore.js')
const _static_js_1 = require('./_static.js')
class TypedFirestoreAdmin extends TypedFirestore_js_1.TypedFirestoreUniv {
  constructor(model, raw) {
    super(model, (0, _static_js_1.createFirestoreStaticAdmin)(firestore), raw)
    Object.defineProperty(this, 'model', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: model,
    })
    Object.defineProperty(this, 'raw', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: raw,
    })
  }
}
exports.TypedFirestoreAdmin = TypedFirestoreAdmin
