import { EntriesStrict, P } from 'lifts'
import { R } from '../lib/fp'
import { is } from '../lib/type'
import { allowOptions, STypes } from '../types/Fireschema'
import { $and, $or } from '../utils/operators'
import { join, _ } from '../utils/_string'
import { renderFunctions } from './functions'

let index = 0

export const renderRules = (
  $allow: STypes.AllowOptions,
  $schema: STypes.DataSchemaOptions<any> | STypes.DataSchemaOptions<any>[],
  pIndent: number,
) => {
  const indent = pIndent + 2

  const validator = (arg: string) => `__validator_${index}__(${arg})`

  const validatorBody = P(
    is.array($schema) ? $schema : [$schema],
    R.map(EntriesStrict),
    R.map(
      R.flatMap(([key, type]) => {
        return P(
          type.split(' | '),
          R.map((t) => `data.${String(key)} is ${t}`),
          $or,
        )
      }),
    ),
    R.map($and),
    $or,
  )

  // const validatorBody_ = P(
  //   $schema,
  //   EntriesStrict,
  //   R.flatMap(([key, type]) => {
  //     return P(
  //       type.split(' | '),
  //       R.map((t) => `data.${String(key)} is ${t}`),
  //       $or,
  //     );
  //   }),
  //   $and,
  // );

  const functions = renderFunctions(
    {
      [validator('data')]: `
        return ${validatorBody};
      `,
    },
    pIndent,
  )

  const validationRule = validator('request.resource.data')

  const rules = P(
    $allow,
    EntriesStrict,
    R.map(([op, condition]) => {
      if (op in allowOptions.write) {
        return [op, $and([condition!, validationRule])]
      }
      return [op, condition]
    }),
    R.map(([op, condition]) => {
      return `${_(indent)}allow ${op}: if ${condition};`
    }),
    join('\n'),
  )

  index++

  return join('\n\n')([functions, rules])
}
