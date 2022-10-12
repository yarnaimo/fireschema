"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fieldToDart = exports._objectToClass = exports.schemaToClassWithMeta = void 0;
const zod_1 = require("zod");
const SchemaType_js_1 = require("../../types/SchemaType.js");
// eslint-disable-next-line import/extensions
const schemaToClassWithMeta = (t, className, collectionPath) => {
    return (0, exports._objectToClass)(t, className, collectionPath, 0, true, []);
};
exports.schemaToClassWithMeta = schemaToClassWithMeta;
const _objectToClass = (t, className, collectionPath, objectNum, root, objects) => {
    let result = [
        `@freezed`,
        `class ${className} with _$${className} {`,
        `  const factory ${className}({`,
    ].join('\n');
    if (root) {
        result = [
            `${result}`,
            `    @JsonKey(ignore: true) String? documentID,`,
            `    @JsonKey(ignore: true) DocumentSnapshot? snapshot,`,
        ].join('\n');
    }
    for (const [key, _t] of Object.entries(t.shape)) {
        const [filedName, objectNum_, objects_, nullable_, isDate_] = (0, exports._fieldToDart)(_t, className, true, false, false, (name) => name, objectNum, objects);
        objectNum = objectNum_;
        objects = objects_;
        if (nullable_) {
            if (isDate_) {
                result = `${result}\n    @NullableDateTimeConverter() ${filedName} ${key},`;
            }
            else {
                result = `${result}\n    @JsonKey() ${filedName} ${key},`;
            }
        }
        else {
            if (isDate_) {
                result = `${result}\n    @DateTimeConverter() required ${filedName} ${key},`;
            }
            else {
                result = `${result}\n    @JsonKey() required ${filedName} ${key},`;
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
    ].join('\n');
    if (root) {
        result = [
            `${result}`,
            `  factory ${className}.fromDoc(DocumentSnapshot doc) {`,
            `    final data = ${className}.fromJson(doc.data()! as Map<String, dynamic>);`,
            `    return data.copyWith(documentID: doc.id, snapshot: doc);`,
            `  }`,
        ].join('\n');
    }
    result = [`${result}`, `}`].join('\n');
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
        ].join('\n');
    }
    for (const [name, obj] of objects) {
        result = `${result}\n\n${(0, exports._objectToClass)(obj, name, collectionPath, 0, false, [])}`;
    }
    return result;
};
exports._objectToClass = _objectToClass;
const _fieldToDart = (t, parentName, root, isTime, nullableField, filedNameGen, objectNum, objects) => {
    if (t instanceof zod_1.ZodOptional) {
        return (0, exports._fieldToDart)(t.unwrap(), parentName, false, false, root ? true : nullableField, (name) => {
            const name_ = filedNameGen(name);
            if (name_.slice(-1) == '?')
                return name_;
            return `${name_}?`;
        }, objectNum, objects);
    }
    if (t instanceof zod_1.ZodNullable) {
        return (0, exports._fieldToDart)(t.unwrap(), parentName, false, false, root ? true : nullableField, (name) => {
            const name_ = filedNameGen(name);
            if (name_.slice(-1) == '?')
                return name_;
            return `${name_}?`;
        }, objectNum, objects);
    }
    if (t instanceof zod_1.ZodAny)
        return [filedNameGen(`any`), objectNum, objects, nullableField, isTime];
    if (t instanceof zod_1.ZodUnknown)
        return [filedNameGen(`any`), objectNum, objects, nullableField, isTime];
    if (t instanceof zod_1.ZodBoolean)
        return [filedNameGen(`bool`), objectNum, objects, nullableField, isTime];
    if (t instanceof SchemaType_js_1.ZodTimestamp)
        return [filedNameGen(`CustomDate`), objectNum, objects, nullableField, true];
    if (t instanceof zod_1.ZodString)
        return [filedNameGen(`String`), objectNum, objects, nullableField, isTime];
    if (t instanceof zod_1.ZodRecord)
        throw Error('Dart との兼ね合いの関係上, ZodRecord は使えません');
    if (t instanceof zod_1.ZodIntersection)
        throw Error('Dart との兼ね合いの関係上, ZodIntersection は使えません');
    if (t instanceof zod_1.ZodUndefined)
        throw Error('Dart との兼ね合いの関係上, ZodUndefined は使えません。optional()の使用を検討してください');
    if (t instanceof zod_1.ZodNull)
        throw Error('Dart との兼ね合いの関係上, ZodUndefined は使えません。nullable()の使用を検討してください');
    if (t instanceof zod_1.ZodLiteral)
        throw Error('Dart との兼ね合いの関係上, ZodLiteral は使えません');
    if (t instanceof zod_1.ZodUnion)
        throw Error('Dart との兼ね合いの関係上, ZodUnion は使えません');
    if (t instanceof zod_1.ZodTuple)
        throw Error('Dart との兼ね合いの関係上, ZodTuple は使えません');
    if (t instanceof zod_1.ZodNumber) {
        return [
            filedNameGen(t.isInt ? `num` : `double`),
            objectNum,
            objects,
            nullableField,
            isTime,
        ];
    }
    if (t instanceof zod_1.ZodArray) {
        return (0, exports._fieldToDart)(t.element, parentName, false, false, nullableField, (name) => filedNameGen(`List<${name}>`), objectNum, objects);
    }
    if (t instanceof zod_1.ZodObject) {
        objectNum++;
        const subClassName = `${parentName}Sub${objectNum}`;
        objects.push([subClassName, t]);
        return [
            filedNameGen(subClassName),
            objectNum,
            objects,
            nullableField,
            isTime,
        ];
    }
    throw new Error(`unhandled type ${t.constructor.name} at`);
};
exports._fieldToDart = _fieldToDart;
const _genarateCollectionRef = (collectionPath) => {
    let result = 'FirebaseFirestore.instance';
    const nestCount = collectionPath.split('/').length - 1;
    collectionPath
        .slice(1)
        .split('/')
        .forEach((path, index) => {
        if (index == nestCount - 1)
            return;
        if (index % 2 == 0) {
            result = `${result}\n            .collection('${path}')`;
        }
        else {
            result = `${result}\n            .doc(${path.slice(1, -1)})`;
        }
    });
    return result;
};
const _genarateClinetConstructor = (collectionPath) => {
    let result = '';
    const nestCount = collectionPath.split('/').length - 1;
    collectionPath
        .slice(1)
        .split('/')
        .forEach((path, index) => {
        if (index % 2 == 0) {
            return;
        }
        if (index > nestCount - 2) {
            return;
        }
        if (index == nestCount - 3) {
            result = `${result}String ${path.slice(1, -1)}`;
            return;
        }
        result = `${result}String ${path.slice(1, -1)}, `;
    });
    return result;
};
