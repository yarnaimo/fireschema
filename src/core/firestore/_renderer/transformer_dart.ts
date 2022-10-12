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
  collectionPath: string,
): string => {
  return _objectToClass(t, className, collectionPath, 0, true, [])
}

export const _objectToClass = (
  t: ZodObject<any>,
  className: string,
  collectionPath: string,
  objectNum: number,
  root: boolean,
  objects: [string, ZodObject<any>][],
): string => {
  let result = [
    `@freezed`,
    `class ${className} with _$${className} {`,
    `  const factory ${className}({`,
  ].join('\n')

  if (root) {
    result = [
      `${result}`,
      `    @JsonKey(ignore: true) String? documentID,`,
      `    @JsonKey(ignore: true) DocumentSnapshot? snapshot,`,
    ].join('\n')
  }

  for (const [key, _t] of Object.entries(t.shape)) {
    const [filedName, objectNum_, objects_, nullable_, isDate_] = _fieldToDart(
      _t as any,
      className,
      true,
      false,
      false,
      (name) => name,
      objectNum,
      objects,
    )
    objectNum = objectNum_
    objects = objects_
    if (nullable_) {
      if (isDate_) {
        result = `${result}\n    @NullableDateTimeConverter() ${filedName} ${key},`
      } else {
        result = `${result}\n    @JsonKey() ${filedName} ${key},`
      }
    } else {
      if (isDate_) {
        result = `${result}\n    @DateTimeConverter() required ${filedName} ${key},`
      } else {
        result = `${result}\n    @JsonKey() required ${filedName} ${key},`
      }
    }
  }

  result = [
    `${result}`,
    `  }) = _${className};`,
    ``,
    `  const ${className}._();`,
    ``,
    `  factory ${className}.fromJson(Map<String, dynamic> json) =>`,
    `      _$${className}FromJson(json);`,
    ``,
  ].join('\n')

  if (root) {
    result = [
      `${result}`,
      `  factory ${className}.fromDoc(DocumentSnapshot doc) {`,
      `    final data = ${className}.fromJson(doc.data()! as Map<String, dynamic>);`,
      `    return data.copyWith(documentID: doc.id, snapshot: doc);`,
      `  }`,
    ].join('\n')
  }

  result = [`${result}`, `}`].join('\n')

  if (root) {
    result = [
      `${result}`,
      ``,
      `class ${className}Serilizer implements FirestoreSerializer<${className}> {`,
      `  @override`,
      `  ${className} fromDoc(DocumentSnapshot doc) => ${className}.fromDoc(doc);`,
      ``,
      `  @override`,
      `  Map<String, dynamic> toMap(${className} data) => data.toJson();`,
      `}`,
      ``,
      `class ${className}Client with FirestoreModelClient<${className}> {`,
      `  ${className}Client(${_genarateClinetConstructor(collectionPath)})`,
      `      : _collectionRef = ${_genarateCollectionRef(collectionPath)};`,
      ``,
      `  @override`,
      `  final CollectionReference _collectionRef;`,
      ``,
      `  @override`,
      `  final _serializer = ${className}Serilizer();`,
      `}`,
    ].join('\n')
  }

  for (const [name, obj] of objects) {
    result = `${result}\n\n${_objectToClass(
      obj,
      name,
      collectionPath,
      0,
      false,
      [],
    )}`
  }
  return result
}

export const _fieldToDart = (
  t: ZodTypeAny,
  parentName: string,
  root: boolean,
  isTime: boolean,
  nullableField: boolean,
  filedNameGen: (name: string) => string,
  objectNum: number,
  objects: [string, ZodObject<any>][],
): [string, number, [string, ZodObject<any>][], boolean, boolean] => {
  if (t instanceof ZodOptional) {
    return _fieldToDart(
      t.unwrap(),
      parentName,
      false,
      isTime,
      root ? true : nullableField,
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
      false,
      isTime,
      root ? true : nullableField,
      (name) => {
        const name_ = filedNameGen(name)
        if (name_.slice(-1) == '?') return name_
        return `${name_}?`
      },
      objectNum,
      objects,
    )
  }

  if (t instanceof ZodRecord) {
    return _fieldToDart(
      t.element,
      parentName,
      false,
      isTime,
      nullableField,
      (name) => filedNameGen(`Map<String, ${name}>`),
      objectNum,
      objects,
    )
  }

  if (t instanceof ZodAny)
    return [filedNameGen(`any`), objectNum, objects, nullableField, isTime]
  if (t instanceof ZodUnknown)
    return [filedNameGen(`any`), objectNum, objects, nullableField, isTime]
  if (t instanceof ZodBoolean)
    return [filedNameGen(`bool`), objectNum, objects, nullableField, isTime]
  if (t instanceof ZodTimestamp)
    return [filedNameGen(`CustomDate`), objectNum, objects, nullableField, true]
  if (t instanceof ZodString)
    return [filedNameGen(`String`), objectNum, objects, nullableField, isTime]

  if (t instanceof ZodIntersection)
    throw Error('Dart との兼ね合いの関係上, ZodIntersection は使えません')
  if (t instanceof ZodUndefined)
    throw Error(
      'Dart との兼ね合いの関係上, ZodUndefined は使えません。optional()の使用を検討してください',
    )
  if (t instanceof ZodNull)
    throw Error(
      'Dart との兼ね合いの関係上, ZodNull は使えません。nullable()の使用を検討してください',
    )
  if (t instanceof ZodLiteral)
    throw Error('Dart との兼ね合いの関係上, ZodLiteral は使えません')
  if (t instanceof ZodUnion)
    throw Error('Dart との兼ね合いの関係上, ZodUnion は使えません')
  if (t instanceof ZodTuple)
    throw Error('Dart との兼ね合いの関係上, ZodTuple は使えません')

  if (t instanceof ZodNumber) {
    return [filedNameGen(`num`), objectNum, objects, nullableField, isTime]
  }

  if (t instanceof ZodArray) {
    return _fieldToDart(
      t.element,
      parentName,
      false,
      isTime,
      nullableField,
      (name) => filedNameGen(`List<${name}>`),
      objectNum,
      objects,
    )
  }

  if (t instanceof ZodObject) {
    objectNum++
    const subClassName = `${parentName}Sub${objectNum}`
    objects.push([subClassName, t])
    return [
      filedNameGen(subClassName),
      objectNum,
      objects,
      nullableField,
      isTime,
    ]
  }

  throw new Error(`unhandled type ${t.constructor.name} at`)
}

const _genarateCollectionRef = (collectionPath: string): string => {
  let result = 'FirebaseFirestore.instance'
  const nestCount = collectionPath.split('/').length - 1

  collectionPath
    .slice(1)
    .split('/')
    .forEach((path, index) => {
      if (index == nestCount - 1) return
      if (index % 2 == 0) {
        result = `${result}\n            .collection('${path}')`
      } else {
        result = `${result}\n            .doc(${path.slice(1, -1)})`
      }
    })
  return result
}

const _genarateClinetConstructor = (collectionPath: string): string => {
  let result = ''
  const nestCount = collectionPath.split('/').length - 1

  collectionPath
    .slice(1)
    .split('/')
    .forEach((path, index) => {
      if (index % 2 == 0) {
        return
      }

      if (index > nestCount - 2) {
        return
      }

      if (index == nestCount - 3) {
        result = `${result}String ${path.slice(1, -1)}`
        return
      }
      result = `${result}String ${path.slice(1, -1)}, `
    })
  return result
}
