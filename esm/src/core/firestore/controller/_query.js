import { endAt, endBefore, limit, limitToLast, orderBy, startAfter, startAt, where, } from 'firebase/firestore';
export const queryBuilderWeb = {
    endAt,
    endBefore,
    limit,
    limitToLast,
    orderBy,
    startAfter,
    startAt,
    where,
};
export const queryBuilderAdmin = Object.fromEntries(Object.keys(queryBuilderWeb).map((key) => {
    return [
        key,
        (...args) => {
            return (q) => q[key](...args);
        },
    ];
}));
export const queryAdmin = (query, ...queryConstraints) => {
    return queryConstraints.reduce((pre, constraint) => {
        return constraint(pre);
    }, query);
};
