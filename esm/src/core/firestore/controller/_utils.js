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
        this.firestoreStatic = firestoreStatic;
        this.mergeOptions = { merge: true };
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
