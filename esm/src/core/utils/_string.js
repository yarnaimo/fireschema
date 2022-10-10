import { is } from '../../lib/type.js';
export const _ = (n) => ' '.repeat(n);
export const join = (separator) => (array) => is.emptyArray(array) ? null : array.filter(is.string).join(separator);
