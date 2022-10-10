import { JsonValue } from 'type-fest';
import { ParseReturnType, ZodIntersection, ZodObject, ZodType, ZodUnion } from 'zod';
import { FTypes } from './index.js';
export declare namespace SchemaType {
    type _DocData = ZodObject<any> | ZodUnion<any> | ZodIntersection<any, any>;
    type _JsonData = _DocData & {
        _output: JsonValue;
    };
}
export declare class ZodTimestamp extends ZodType<FTypes.Timestamp> {
    _parse(input: any): ParseReturnType<FTypes.Timestamp>;
}
export declare const timestampType: () => ZodTimestamp;
