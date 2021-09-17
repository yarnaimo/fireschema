import { _ } from '../../utils/_string.js'

let validatorIndex = 0
export const addValidatorIndex = () => {
  validatorIndex++
}

const format = (rulesString: string, indent: number) => {
  return rulesString
    .split('\n')
    .map((line, i, arr) => {
      return i === 0
        ? line
        : i === arr.length - 1 || line === ') || (' || line === ') && ('
        ? `${_(indent + 2)}${line}`
        : `${_(indent + 4)}${line}`
    })
    .join('\n')
}

export const validatorCall = (arg: string, label?: string) =>
  `__validator_${label || validatorIndex}__(${arg})`

export const validatorDef = (
  arg: string,
  rulesString: string,
  indent: number,
  label?: string,
) => ({
  [validatorCall(arg, label)]: `
    return ${format(rulesString, indent)};
  `,
})
