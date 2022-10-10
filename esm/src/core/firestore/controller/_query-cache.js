import { createConverter } from '../../utils/_firestore.js';
import { queryEqualUniv } from './_universal.js';
const queryCache = {};
export const findCachedQuery = (collectionName, rawQuery) => {
    var _a;
    const queries = queryCache[collectionName];
    return (_a = queries === null || queries === void 0 ? void 0 : queries.find((q) => queryEqualUniv(q.raw, rawQuery))) === null || _a === void 0 ? void 0 : _a.converted;
};
export const addQueryCache = (collectionName, rawQuery, convertedQuery) => {
    const queries = queryCache[collectionName];
    const newQueries = [
        ...(queries !== null && queries !== void 0 ? queries : []),
        { raw: rawQuery, converted: convertedQuery },
    ];
    queryCache[collectionName] = newQueries;
};
export const withDecoder = (rawQuery, model, collectionName) => {
    const { decoder } = model;
    const cachedQuery = findCachedQuery(collectionName, rawQuery);
    if (cachedQuery) {
        return cachedQuery;
    }
    const convertedQuery = rawQuery.withConverter(createConverter(decoder));
    addQueryCache(collectionName, rawQuery, convertedQuery);
    return convertedQuery;
};
