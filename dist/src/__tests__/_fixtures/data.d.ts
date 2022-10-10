import { FirestoreStatic } from '../../core/firestore/controller/_static.js'
import { FTypes } from '../../core/types/index.js'
import { Type } from '../../lib/type.js'
import { IPostA, IUser } from './firestore-schema.js'
export declare const userDataBase: {
  name: string
  displayName: null
  age: number
  tags: {
    id: number
    name: string
  }[]
  options: {
    a: boolean
    b: string
  }
}
export declare const createUserData: ({
  serverTimestamp,
}: FirestoreStatic<FTypes.FirestoreApp>) => Type.Merge<
  IUser,
  {
    timestamp: FTypes.FieldValue
  }
>
export declare const userDataJson: {
  timestamp: string
  name: string
  displayName: string | null
  age: number
  tags: {
    id: number
    name: string
  }[]
  options?:
    | {
        a: boolean
        b: string
      }
    | undefined
}
export declare const postAData: IPostA
