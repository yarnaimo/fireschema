"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fieldToDart = exports._objectToClass = exports.schemaToClassWithMeta = void 0;
const zod_1 = require("zod");
const SchemaType_js_1 = require("../../types/SchemaType.js");
// eslint-disable-next-line import/extensions
const schemaToClassWithMeta = (t, className) => {
    return (0, exports._objectToClass)(t, className, 0, []);
};
exports.schemaToClassWithMeta = schemaToClassWithMeta;
const _objectToClass = (t, className, objectNum, objects) => {
    let result = `class ${className} {`;
    for (const [key, _t] of Object.entries(t.shape)) {
        const [filedName, objectNum_, objects_] = (0, exports._fieldToDart)(_t, className, (name) => name, objectNum, objects);
        objectNum = objectNum_;
        objects = objects_;
        result = `${result}\n  final ${filedName} ${key};`;
    }
    result = `${result}\n}`;
    for (const [name, obj] of objects) {
        result = `${result}\n\n${(0, exports._objectToClass)(obj, name, 0, [])}`;
    }
    return result;
};
exports._objectToClass = _objectToClass;
const _fieldToDart = (t, parentName, filedNameGen, objectNum, objects) => {
    if (t instanceof zod_1.ZodOptional) {
        return (0, exports._fieldToDart)(t.unwrap(), parentName, (name) => `${filedNameGen(name)}?`, objectNum, objects);
    }
    if (t instanceof zod_1.ZodNullable) {
        return (0, exports._fieldToDart)(t.unwrap(), parentName, (name) => `${filedNameGen(name)}?`, objectNum, objects);
    }
    if (t instanceof zod_1.ZodAny)
        return [filedNameGen(`any`), objectNum, objects];
    if (t instanceof zod_1.ZodUnknown)
        return [filedNameGen(`any`), objectNum, objects];
    if (t instanceof zod_1.ZodBoolean)
        return [filedNameGen(`bool`), objectNum, objects];
    if (t instanceof SchemaType_js_1.ZodTimestamp)
        return [filedNameGen(`Timestamp`), objectNum, objects];
    if (t instanceof zod_1.ZodString)
        return [filedNameGen(`String`), objectNum, objects];
    if (t instanceof zod_1.ZodRecord)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodIntersection)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodUndefined)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodNull)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodLiteral)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodUnion)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodTuple)
        return [filedNameGen(`error`), objectNum, objects];
    if (t instanceof zod_1.ZodNumber) {
        return [filedNameGen(t.isInt ? `int` : `double`), objectNum, objects];
    }
    if (t instanceof zod_1.ZodArray) {
        return (0, exports._fieldToDart)(t.element, parentName, (name) => filedNameGen(`List<${name}>`), objectNum, objects);
    }
    if (t instanceof zod_1.ZodObject) {
        objectNum++;
        const subClassName = `${parentName}Sub${objectNum}`;
        objects.push([subClassName, t]);
        return [filedNameGen(subClassName), objectNum, objects];
    }
    throw new Error(`unhandled type ${t.constructor.name} at`);
};
exports._fieldToDart = _fieldToDart;
