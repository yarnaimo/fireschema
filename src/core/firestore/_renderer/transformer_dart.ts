import {
  ZodAny,
  ZodArray,
  ZodBoolean,
  ZodIntersection,
  ZodLiteral,
  ZodNull,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodString,
  ZodTuple,
  ZodTypeAny,
  ZodUndefined,
  ZodUnion,
  ZodUnknown,
} from 'zod'

import { ZodTimestamp } from '../../types/SchemaType.js'
// eslint-disable-next-line import/extensions

export const schemaToClassWithMeta = (
  t: ZodObject<any>,
  className: string,
): string => {
  return _objectToClass(t, className, 0, [])
}

export const _objectToClass = (
  t: ZodObject<any>,
  className: string,
  objectNum: number,
  objects: [string, ZodObject<any>][],
): string => {
  let result = `@immutable\nclass ${className} {`
  for (const [key, _t] of Object.entries(t.shape)) {
    const [filedName, objectNum_, objects_] = _fieldToDart(
      _t as any,
      className,
      (name) => name,
      objectNum,
      objects,
    )
    objectNum = objectNum_
    objects = objects_
    result = `${result}\n  final ${filedName} ${key};`
  }

  result = `${result}\n}`
  for (const [name, obj] of objects) {
    result = `${result}\n\n${_objectToClass(obj, name, 0, [])}`
  }
  return result
}

export const _fieldToDart = (
  t: ZodTypeAny,
  parentName: string,
  filedNameGen: (name: string) => string,
  objectNum: number,
  objects: [string, ZodObject<any>][],
): [string, number, [string, ZodObject<any>][]] => {
  if (t instanceof ZodOptional) {
    return _fieldToDart(
      t.unwrap(),
      parentName,
      (name) => {
        const name_ = filedNameGen(name)
        if (name_.slice(-1) == '?') return name_
        return `${name_}?`
      },
      objectNum,
      objects,
    )
  }

  if (t instanceof ZodNullable) {
    return _fieldToDart(
      t.unwrap(),
      parentName,
      (name) => {
        const name_ = filedNameGen(name)
        if (name_.slice(-1) == '?') return name_
        return `${name_}?`
      },
      objectNum,
      objects,
    )
  }

  if (t instanceof ZodAny) return [filedNameGen(`any`), objectNum, objects]
  if (t instanceof ZodUnknown) return [filedNameGen(`any`), objectNum, objects]
  if (t instanceof ZodBoolean) return [filedNameGen(`bool`), objectNum, objects]
  if (t instanceof ZodTimestamp)
    return [filedNameGen(`Timestamp`), objectNum, objects]
  if (t instanceof ZodString)
    return [filedNameGen(`String`), objectNum, objects]

  if (t instanceof ZodRecord) return [filedNameGen(`error`), objectNum, objects]
  if (t instanceof ZodIntersection)
    return [filedNameGen(`error`), objectNum, objects]
  if (t instanceof ZodUndefined)
    return [filedNameGen(`error`), objectNum, objects]
  if (t instanceof ZodNull) return [filedNameGen(`error`), objectNum, objects]
  if (t instanceof ZodLiteral)
    return [filedNameGen(`error`), objectNum, objects]
  if (t instanceof ZodUnion) return [filedNameGen(`error`), objectNum, objects]
  if (t instanceof ZodTuple) return [filedNameGen(`error`), objectNum, objects]

  if (t instanceof ZodNumber) {
    return [filedNameGen(t.isInt ? `int` : `double`), objectNum, objects]
  }

  if (t instanceof ZodArray) {
    return _fieldToDart(
      t.element,
      parentName,
      (name) => filedNameGen(`List<${name}>`),
      objectNum,
      objects,
    )
  }

  if (t instanceof ZodObject) {
    objectNum++
    const subClassName = `${parentName}Sub${objectNum}`
    objects.push([subClassName, t])
    return [filedNameGen(subClassName), objectNum, objects]
  }

  throw new Error(`unhandled type ${t.constructor.name} at`)
}
