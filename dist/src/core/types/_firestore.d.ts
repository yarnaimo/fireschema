export declare type ParseCollectionPath<P extends string> = P extends `${infer C}/${infer DT}` ? DT extends `${infer D}/${infer T}` ? [C, ...ParseCollectionPath<T>] : never : [P];
export declare type ParseDocumentPath<P extends string> = P extends `${infer C}/${infer DT}` ? DT extends `${infer D}/${infer T}` ? `${C}.${ParseDocumentPath<T>}` : C : never;
