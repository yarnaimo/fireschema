import { _ } from '../../utils/_string.js';
let validatorIndex = 0;
export const addValidatorIndex = () => {
    validatorIndex++;
};
const format = (rulesString, indent) => {
    return rulesString
        .split('\n')
        .map((line, i, arr) => {
        return i === 0
            ? line
            : i === arr.length - 1 || line === ') || (' || line === ') && ('
                ? `${_(indent + 2)}${line}`
                : `${_(indent + 2)}${line}`;
    })
        .join('\n');
};
export const validatorDef = (arg, rulesString, label) => ({
    [label]: `
    ${format(rulesString, 0)};
  `,
});
