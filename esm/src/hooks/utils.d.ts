import dayjs from 'dayjs';
import { CollectionReference, DocumentReference, Query } from 'firebase/firestore';
declare type RefOrQuery = DocumentReference | CollectionReference | Query;
export declare const useSafeRef: <T extends RefOrQuery>(ref: T) => {
    safeRef: T;
    refChanged: boolean;
    timestamps: import("react").MutableRefObject<dayjs.Dayjs[]>;
};
export declare const useFirestoreErrorLogger: (error: Error | undefined) => void;
export {};
