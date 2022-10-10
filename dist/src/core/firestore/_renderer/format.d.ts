export declare const addValidatorIndex: () => void
export declare const validatorCall: (
  arg: string,
  label?: string | undefined,
) => string
export declare const validatorDef: (
  arg: string,
  rulesString: string,
  indent: number,
  label?: string | undefined,
) => {
  [x: string]: string
}
