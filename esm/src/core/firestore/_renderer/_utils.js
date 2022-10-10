import { P } from 'lifts';
import { R } from '../../../lib/fp.js';
export const parseSchemaOptions = (options) => {
    const entries = Object.entries(options);
    const functions = P(entries, R.flatMap(([k, v]) => k.startsWith('function ') ? [[k.replace('function ', ''), v]] : []), (filtered) => (filtered.length ? Object.fromEntries(filtered) : undefined));
    const collections = Object.fromEntries(entries.filter(([k]) => k.includes('/')));
    return { functions, collections };
};
