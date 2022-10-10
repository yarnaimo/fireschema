import dayjs from 'dayjs';
import { Query, queryEqual, refEqual, } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
const queryOrRefEqual = (left, right) => {
    return left instanceof Query
        ? queryEqual(left, right)
        : refEqual(left, right);
};
const isEqual = (left, right) => {
    const bothNull = !left && !right;
    const equal = !!left && !!right && queryOrRefEqual(left, right);
    return bothNull || equal;
};
export const useSafeRef = (ref) => {
    var _a, _b;
    const timestampsRef = useRef([]);
    const memoizedRef = useRef();
    const refChanged = !isEqual(memoizedRef.current, ref);
    if (refChanged) {
        memoizedRef.current = ref;
        timestampsRef.current = [dayjs(), ...timestampsRef.current];
    }
    const exceeded = useRef(false);
    const a = !!((_a = timestampsRef.current[3]) === null || _a === void 0 ? void 0 : _a.isAfter(dayjs().subtract(3, 'second')));
    const b = !!((_b = timestampsRef.current[5]) === null || _b === void 0 ? void 0 : _b.isAfter(dayjs().subtract(5, 'second')));
    exceeded.current || (exceeded.current = a || b);
    const safeRef = exceeded.current ? undefined : memoizedRef.current;
    if (!safeRef) {
        console.error('%cRef change limit exceeded!!!', 'font-weight: bold; font-size: large; color: red;');
        throw new Promise(() => { });
    }
    return { safeRef, refChanged, timestamps: timestampsRef };
};
export const useFirestoreErrorLogger = (error) => {
    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);
};
