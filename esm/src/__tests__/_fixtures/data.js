import { firestoreStaticWeb, } from '../../core/firestore/controller/_static.js';
export const userDataBase = {
    name: 'name1',
    displayName: null,
    age: 16,
    tags: [
        { id: 0, name: 'tag0' },
        { id: 1, name: 'tag1' },
    ],
    options: { a: true, b: 'value' },
};
export const createUserData = ({ serverTimestamp, }) => ({
    ...userDataBase,
    timestamp: serverTimestamp(),
});
export const userDataJson = {
    ...createUserData(firestoreStaticWeb),
    timestamp: new Date().toISOString(),
};
export const postAData = { type: 'a', text: 'value' };
