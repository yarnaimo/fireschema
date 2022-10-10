import { STypes } from '../types/index.js';
export declare const rules: {
    or: (...conditions: STypes.ConditionExp[]) => string;
    and: (...conditions: STypes.ConditionExp[]) => string;
    orMultiline: (...conditions: STypes.ConditionExp[]) => string;
    andMultiline: (...conditions: STypes.ConditionExp[]) => string;
    basePath: "/databases/$(database)/documents";
};
