import { useMemo, useRef } from 'react';
import { useFirestoreDoc, useFirestoreDocOnce } from 'reactfire';
import { useDocumentSnapData } from './useSnapData.js';
import { useFirestoreErrorLogger, useSafeRef } from './utils.js';
const createUseTypedDocHook = (hook) => {
    return (typedRef, { suspense = true, ...dataOptions } = {}) => {
        const { safeRef, refChanged } = useSafeRef(typedRef.raw);
        const memoizedTypedRef = useRef();
        if (refChanged) {
            memoizedTypedRef.current = typedRef;
        }
        const { data: _snap, error } = hook(safeRef, { suspense });
        useFirestoreErrorLogger(error);
        const { snap, data } = useDocumentSnapData(typedRef, _snap, dataOptions);
        return useMemo(() => {
            refChanged;
            return { ref: memoizedTypedRef.current, snap, data, error };
        }, [data, error, refChanged, snap]);
    };
};
export const useTypedDoc = createUseTypedDocHook(useFirestoreDoc);
export const useTypedDocOnce = createUseTypedDocHook(useFirestoreDocOnce);
