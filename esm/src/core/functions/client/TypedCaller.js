import { httpsCallable } from 'firebase/functions';
import { is } from '../../../lib/type.js';
const encode = (data) => {
    return Object.fromEntries(Object.entries(data).flatMap(([key, value]) => {
        if (value === undefined) {
            return [];
        }
        if (!is.array(value) && is.object(value)) {
            return [[key, encode(value)]];
        }
        return [[key, value]];
    }));
};
export class TypedCaller {
    constructor(functionsApp) {
        Object.defineProperty(this, "functionsApp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functionsApp
        });
    }
    async call(functionPath, data, options) {
        const name = ['callable', functionPath].join('-');
        const callable = httpsCallable(this.functionsApp, name, options);
        try {
            const result = await callable(encode(data));
            return {
                data: result.data,
            };
        }
        catch (error) {
            return { error: error };
        }
    }
}
