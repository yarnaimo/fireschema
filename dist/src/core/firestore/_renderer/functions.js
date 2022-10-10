'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.renderFunctions = void 0
const lifts_1 = require('lifts')
const fp_js_1 = require('../../../lib/fp.js')
const _string_js_1 = require('../../utils/_string.js')
const renderFunctions = (functions, pIndent) => {
  const indent = pIndent + 2
  return (0, lifts_1.P)(
    functions,
    lifts_1.EntriesStrict,
    fp_js_1.R.map(([key, value]) =>
      [
        `${(0, _string_js_1._)(indent)}function ${key} {`,
        `${(0, _string_js_1._)(indent)}  ${value.trim()}`,
        `${(0, _string_js_1._)(indent)}}`,
      ].join('\n'),
    ),
  ).join('\n\n')
}
exports.renderFunctions = renderFunctions
