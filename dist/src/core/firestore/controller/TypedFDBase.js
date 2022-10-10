'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypedFDBase = void 0
const _object_js_1 = require('../../utils/_object.js')
const TypedCollectionRef_js_1 = require('./TypedCollectionRef.js')
const _universal_js_1 = require('./_universal.js')
class TypedFDBase {
  constructor(options, raw) {
    Object.defineProperty(this, 'options', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: options,
    })
    Object.defineProperty(this, 'raw', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: raw,
    })
  }
  origCollection(name) {
    return (0, _universal_js_1.collectionUniv)(this.raw, name)
  }
  collection(collectionName) {
    const loc = (0, _object_js_1.joinLoc)(this.options.loc, collectionName)
    return new TypedCollectionRef_js_1.TypedCollectionRef(
      { ...this.options, loc },
      this.origCollection(collectionName),
    )
  }
}
exports.TypedFDBase = TypedFDBase
