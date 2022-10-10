'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createConverter = exports.firestorePathToLoc = void 0
const firestorePathToLoc = (path) =>
  path
    .split('/')
    .filter((_, i) => i % 2 === 0)
    .join('.')
exports.firestorePathToLoc = firestorePathToLoc
const createConverter = (decoder) => ({
  fromFirestore: (snap, options) => {
    const data = snap.data(options)
    const decodedData = decoder ? decoder(data, snap) : data
    return {
      ...decodedData,
      id: snap.id,
    }
  },
  toFirestore: (data) => data,
})
exports.createConverter = createConverter
