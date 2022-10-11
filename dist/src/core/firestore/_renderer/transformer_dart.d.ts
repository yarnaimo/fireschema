import { ZodObject, ZodTypeAny } from 'zod';
export declare const schemaToClassWithMeta: (t: ZodObject<any>, className: string) => string;
export declare const _objectToClass: (t: ZodObject<any>, className: string, objectNum: number, objects: [string, ZodObject<any>][]) => string;
export declare const _fieldToDart: (t: ZodTypeAny, parentName: string, filedNameGen: (name: string) => string, objectNum: number, objects: [string, ZodObject<any>][]) => [string, number, [string, ZodObject<any>][]];
