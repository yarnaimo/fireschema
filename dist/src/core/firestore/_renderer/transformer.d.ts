import { ZodTypeAny } from 'zod';
export declare const schemaToRuleWithMeta: (t: ZodTypeAny) => string;
export declare const _schemaToRule: (parent?: string | null, key?: string | number) => (t: ZodTypeAny) => string;
