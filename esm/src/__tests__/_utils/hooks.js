export const wrapSuspendable = (fn) => {
    let result;
    try {
        result = fn();
    }
    catch (error) {
        if (error instanceof Promise) {
            result = null;
        }
        else {
            throw error;
        }
    }
    return result;
};
