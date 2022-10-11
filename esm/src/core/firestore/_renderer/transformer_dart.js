import { ZodAny, ZodArray, ZodBoolean, ZodIntersection, ZodLiteral, ZodNull, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodRecord, ZodString, ZodTuple, ZodUndefined, ZodUnion, ZodUnknown, } from 'zod';
import { ZodTimestamp } from '../../types/SchemaType.js';
// eslint-disable-next-line import/extensions
export const schemaToClassWithMeta = (t, className) => {
    return _objectToClass(t, className, 0, true, []);
};
export const _objectToClass = (t, className, objectNum, root, objects) => {
    let result = [
        `@freezed`,
        `class ${className} with _$${className} {`,
        `  const factory ${className}({`,
    ].join('\n');
    for (const [key, _t] of Object.entries(t.shape)) {
        const [filedName, objectNum_, objects_, nullable_] = _fieldToDart(_t, className, true, false, (name) => name, objectNum, objects);
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
        result = `${result}\n\n${_objectToClass(obj, name, 0, false, [])}`;
    }
    return result;
};
export const _fieldToDart = (t, parentName, root, nullableField, filedNameGen, objectNum, objects) => {
    if (t instanceof ZodOptional) {
        return _fieldToDart(t.unwrap(), parentName, false, root ? true : nullableField, (name) => {
            const name_ = filedNameGen(name);
            if (name_.slice(-1) == '?')
                return name_;
            return `${name_}?`;
        }, objectNum, objects);
    }
    if (t instanceof ZodNullable) {
        return _fieldToDart(t.unwrap(), parentName, false, root ? true : nullableField, (name) => {
            const name_ = filedNameGen(name);
            if (name_.slice(-1) == '?')
                return name_;
            return `${name_}?`;
        }, objectNum, objects);
    }
    if (t instanceof ZodAny)
        return [filedNameGen(`any`), objectNum, objects, nullableField];
    if (t instanceof ZodUnknown)
        return [filedNameGen(`any`), objectNum, objects, nullableField];
    if (t instanceof ZodBoolean)
        return [filedNameGen(`bool`), objectNum, objects, nullableField];
    if (t instanceof ZodTimestamp)
        return [filedNameGen(`Timestamp`), objectNum, objects, nullableField];
    if (t instanceof ZodString)
        return [filedNameGen(`String`), objectNum, objects, nullableField];
    if (t instanceof ZodRecord)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodIntersection)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodUndefined)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodNull)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodLiteral)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodUnion)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodTuple)
        return [filedNameGen(`error`), objectNum, objects, nullableField];
    if (t instanceof ZodNumber) {
        return [
            filedNameGen(t.isInt ? `int` : `double`),
            objectNum,
            objects,
            nullableField,
        ];
    }
    if (t instanceof ZodArray) {
        return _fieldToDart(t.element, parentName, false, nullableField, (name) => filedNameGen(`List<${name}>`), objectNum, objects);
    }
    if (t instanceof ZodObject) {
        objectNum++;
        const subClassName = `${parentName}Sub${objectNum}`;
        objects.push([subClassName, t]);
        return [filedNameGen(subClassName), objectNum, objects, nullableField];
    }
    throw new Error(`unhandled type ${t.constructor.name} at`);
};
