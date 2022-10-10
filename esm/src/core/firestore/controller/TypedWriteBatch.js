import { DocDataHelper, docAsAdmin, docAsWeb } from './_utils.js'
export class TypedWriteBatch {
  constructor(firestoreStatic, raw) {
    this.firestoreStatic = firestoreStatic
    this.raw = raw
    this.dataHelper = new DocDataHelper(this.firestoreStatic)
  }
  async commit() {
    return await this.raw.commit()
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
