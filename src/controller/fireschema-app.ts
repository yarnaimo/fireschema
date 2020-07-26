import { FTypes } from '../types'
import { fadmin, fweb } from '../types/_firestore'

export type FireschemaApp<F extends FTypes.FirestoreApp> = {
  firestore: FTypes.Env<F, typeof fweb, typeof fadmin>
  instance: F
}

export const fireschemaApp = <F extends FTypes.FirestoreApp>(
  firestore: FTypes.Env<F, typeof fweb, typeof fadmin>,
  instance: F,
): FireschemaApp<F> => {
  return { firestore, instance }
}
