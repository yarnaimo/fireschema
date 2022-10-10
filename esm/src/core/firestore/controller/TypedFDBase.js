import { joinLoc } from '../../utils/_object.js'
import { TypedCollectionRef } from './TypedCollectionRef.js'
import { collectionUniv } from './_universal.js'
export class TypedFDBase {
  constructor(options, raw) {
    this.options = options
    this.raw = raw
  }
  origCollection(name) {
    return collectionUniv(this.raw, name)
  }
  collection(collectionName) {
    const loc = joinLoc(this.options.loc, collectionName)
    return new TypedCollectionRef(
      { ...this.options, loc },
      this.origCollection(collectionName),
    )
  }
}
