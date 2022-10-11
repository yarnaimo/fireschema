import { ZodObject, ZodTypeAny } from 'zod';
export declare const schemaToFiledsWithMeta: (t: ZodObject<any>) => string;
export declare const _schemaToField: (t: ZodTypeAny) => string;
export declare const _schemaToOptional: (t: ZodTypeAny) => string;
