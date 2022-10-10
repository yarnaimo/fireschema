'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.join = exports._ = void 0
const type_js_1 = require('../../lib/type.js')
const _ = (n) => ' '.repeat(n)
exports._ = _
const join = (separator) => (array) =>
  type_js_1.is.emptyArray(array)
    ? null
    : array.filter(type_js_1.is.string).join(separator)
exports.join = join
