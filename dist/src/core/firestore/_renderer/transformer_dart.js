"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fieldToDart = exports._objectToClass = exports.schemaToClassWithMeta = void 0;
const zod_1 = require("zod");
const SchemaType_js_1 = require("../../types/SchemaType.js");
// eslint-disable-next-line import/extensions
const schemaToClassWithMeta = (t, className) => {
    return (0, exports._objectToClass)(t, className, 0, true, []);
};
exports.schemaToClassWithMeta = schemaToClassWithMeta;
const _objectToClass = (t, className, objectNum, root, objects) => {
    let result = [
        `@freezed`,
        `class ${className} with _$${className} {`,
        `  const factory ${className}({`,
    ].join('\n');
    for (const [key, _t] of Object.entries(t.shape)) {
        const [filedName, objectNum_, objects_, nullable_] = (0, exports._fieldToDart)(_t, className, true, false, (name) => name, objectNum, objects);
        objectNum = objectNum_;
        objects = objects_;
        if (nullable_) {
            result = `${result}\n    @JsonKey() ${filedName} ${key},`;
        }
        else {
            result = `${result}\n    @JsonKey() required ${filedName} ${key},`;
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
        `}`,
    ].join('\n');
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
        ].join('\n');
    }
    for (const [name, obj] of objects) {
        result = `${result}\n\n${(0, exports._objectToClass)(obj, name, 0, false, [])}`;
    }
    return result;
};
exports._objectToClass = _objectToClass;
const _fieldToDart = (t, parentName, root, nullableField, filedNameGen, objectNum, objects) => {
    if (t instanceof zod_1.ZodOptional) {
        return (0, exports._fieldToDart)(t.unwrap(), parentName, false, root ? true : nullableField, (name) => {
            const name_ = filedNameGen(name);
            if (name_.slice(-1) == '?')
                return name_;
            return `${name_}?`;
        }, objectNum, objects);
    }
    if (t instanceof zod_1.ZodNullable) {
        return (0, exports._fieldToDart)(t.unwrap(), parentName, false, root ? true : nullableField, (name) => {
            const name_ = filedNameGen(name);
            if (name_.slice(-1) == '?')
                return name_;
            return `${name_}?`;
        }, objectNum, objects);
    }
    if (t instanceof zod_1.ZodAny)
        return [filedNameGen(`any`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodUnknown)
        return [filedNameGen(`any`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodBoolean)
        return [filedNameGen(`bool`), objectNum, objects, nullableField];
    if (t instanceof SchemaType_js_1.ZodTimestamp)
        return [filedNameGen(`Timestamp`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodString)
        return [filedNameGen(`String`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodRecord)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodIntersection)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodUndefined)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodNull)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodLiteral)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodUnion)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodTuple)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof zod_1.ZodNumber) {
        return [
            filedNameGen(t.isInt ? `int` : `double`),
            objectNum,
            objects,
            nullableField,
        ];
    }
    if (t instanceof zod_1.ZodArray) {
        return (0, exports._fieldToDart)(t.element, parentName, false, nullableField, (name) => filedNameGen(`List<${name}>`), objectNum, objects);
    }
    if (t instanceof zod_1.ZodObject) {
        objectNum++;
        const subClassName = `${parentName}Sub${objectNum}`;
        objects.push([subClassName, t]);
        return [filedNameGen(subClassName), objectNum, objects, nullableField];
    }
    throw new Error(`unhandled type ${t.constructor.name} at`);
};
exports._fieldToDart = _fieldToDart;
