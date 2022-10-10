import { TypedDocumentSnap } from './TypedDocumentRef.js'
import { DocDataHelper, docAsAdmin, docAsWeb } from './_utils.js'
export class TypedTransaction {
  constructor(options, raw) {
    this.options = options
    this.raw = raw
    this.dataHelper = new DocDataHelper(this.options.firestoreStatic)
  }
  async get(typedDoc) {
    const snap =
      'create' in this.raw
        ? await this.raw.get(docAsAdmin(typedDoc.raw))
        : await this.raw.get(docAsWeb(typedDoc.raw))
    return new TypedDocumentSnap(
      { ...this.options, loc: typedDoc.options.loc },
      snap,
    )
  }
  async getData(typedDoc, dataOptions = {}) {
    const typedSnap = await this.get(typedDoc)
    return typedSnap.data(
      // @ts-ignore TODO:
      dataOptions,
    )
  }
  create(typedDoc, dataOrFn) {
    const args = this.dataHelper.create(dataOrFn)
    if ('create' in this.raw) {
      this.raw.create(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.set(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }
  setMerge(typedDoc, dataOrFn) {
    const args = this.dataHelper.setMerge(dataOrFn)
    if ('create' in this.raw) {
      this.raw.set(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.set(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }
  update(typedDoc, dataOrFn) {
    const args = this.dataHelper.update(dataOrFn)
    if ('create' in this.raw) {
      this.raw.update(docAsAdmin(typedDoc.raw), ...args)
    } else {
      this.raw.update(docAsWeb(typedDoc.raw), ...args)
    }
    return this
  }
  delete(typedDoc) {
    if ('create' in this.raw) {
      this.raw.delete(docAsAdmin(typedDoc.raw))
    } else {
      this.raw.delete(docAsWeb(typedDoc.raw))
    }
    return this
  }
}
