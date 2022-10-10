export declare const getTestAppWeb: (uid: string) => {
    firestore: () => import("@firebase/firestore").Firestore;
    functions: (region: string) => import("@firebase/functions").Functions;
};
export declare const getTestAppAdmin: () => {
    firestore: () => FirebaseFirestore.Firestore;
};
export declare const assertFails: (pr: () => Promise<any>) => Promise<any>;
