import * as firestore from 'firebase-admin/firestore'
import { TypedFirestoreUniv } from './TypedFirestore.js'
import { createFirestoreStaticAdmin } from './_static.js'
export class TypedFirestoreAdmin extends TypedFirestoreUniv {
  constructor(model, raw) {
    super(model, createFirestoreStaticAdmin(firestore), raw)
    this.model = model
    this.raw = raw
  }
}
