import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import React from 'react';
import { TypedCaller } from '../index.js';
const app = initializeApp({
// ...
});
const functionsApp = getFunctions(app, 'asia-northeast1');
export const typedCaller = new TypedCaller(functionsApp);
const Component = () => {
    const createUser = async () => {
        const result = await typedCaller.call('createUser', {
            name: 'test',
            displayName: 'Test',
            age: 20,
            timestamp: new Date().toISOString(),
            options: { a: true },
        });
        if (result.error) {
            console.error(result.error);
            return;
        }
        console.log(result.data);
    };
    return <button onClick={createUser}/>;
};
