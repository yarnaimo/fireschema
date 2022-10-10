'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.renderCollectionGroups = exports.renderCollections = void 0
const lifts_1 = require('lifts')
const fp_js_1 = require('../../../lib/fp.js')
const _string_js_1 = require('../../utils/_string.js')
const _utils_js_1 = require('./_utils.js')
const functions_js_1 = require('./functions.js')
const rules_js_1 = require('./rules.js')
const renderFromArray = (pIndent) => (array) => {
  const indent = pIndent + 2
  return (0, lifts_1.P)(
    array,
    fp_js_1.R.map(
      ([collectionNameWithDocLabel, { model, allow, ...options }]) => {
        const { functions, collections } = (0, _utils_js_1.parseSchemaOptions)(
          options,
        )
        const body = (0, _string_js_1.join)('\n\n')([
          functions
            ? (0, functions_js_1.renderFunctions)(functions, indent)
            : null,
          (0, rules_js_1.renderRules)(allow, model, indent),
          (0, exports.renderCollections)(collections, indent),
        ])
        return (0, _string_js_1.join)('\n')([
          `${(0, _string_js_1._)(indent)}match ${collectionNameWithDocLabel} {`,
          body,
          `${(0, _string_js_1._)(indent)}}`,
        ])
      },
    ),
    (0, _string_js_1.join)('\n\n'),
  )
}
const renderCollections = (collections, pIndent) => {
  return (0, lifts_1.P)(
    collections,
    lifts_1.EntriesStrict,
    renderFromArray(pIndent),
  )
}
exports.renderCollections = renderCollections
const renderCollectionGroups = (collections, pIndent) => {
  return (0, lifts_1.P)(
    collections,
    lifts_1.EntriesStrict,
    fp_js_1.R.map(([collectionPath, options]) => [
      `/{path=**}${collectionPath}`,
      options,
    ]),
    renderFromArray(pIndent),
  )
}
exports.renderCollectionGroups = renderCollectionGroups
