import { is } from '../../../lib/type.js';
import { _createdAt, _updatedAt } from '../../constants/index.js';
export const docAsWeb = (ref) => {
    return ref;
};
export const docAsAdmin = (ref) => {
    return ref;
};
export class DocDataHelper {
    constructor(firestoreStatic) {
        Object.defineProperty(this, "firestoreStatic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: firestoreStatic
        });
        Object.defineProperty(this, "mergeOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { merge: true }
        });
    }
    toCreate(data) {
        return {
            ...data,
            [_createdAt]: this.firestoreStatic.serverTimestamp(),
            [_updatedAt]: this.firestoreStatic.serverTimestamp(),
        };
    }
    toUpdate(data) {
        return {
            ...data,
            [_updatedAt]: this.firestoreStatic.serverTimestamp(),
        };
    }
    dataOf(dataOrFn) {
        return is.function_(dataOrFn) ? dataOrFn(this.firestoreStatic) : dataOrFn;
    }
    create(dataOrFn) {
        return [this.toCreate(this.dataOf(dataOrFn))];
    }
    setMerge(dataOrFn) {
        return [this.toUpdate(this.dataOf(dataOrFn)), this.mergeOptions];
    }
    update(dataOrFn) {
        return [this.toUpdate(this.dataOf(dataOrFn))];
    }
}
