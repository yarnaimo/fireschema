import { ZodObject, ZodTypeAny } from 'zod';
export declare const schemaToClassWithMeta: (t: ZodObject<any>, className: string, collectionPath: string) => string;
export declare const _objectToClass: (t: ZodObject<any>, className: string, collectionPath: string, objectNum: number, root: boolean, objects: [string, ZodObject<any>][]) => string;
export declare const _fieldToDart: (t: ZodTypeAny, parentName: string, root: boolean, isTime: boolean, nullableField: boolean, filedNameGen: (name: string) => string, objectNum: number, objects: [string, ZodObject<any>][]) => [string, number, [string, ZodObject<any>][], boolean, boolean];
