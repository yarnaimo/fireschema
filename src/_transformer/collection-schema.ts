import { P } from 'lifts'
import { Type, TypeNode } from 'ts-morph'
import ts, { factory as f } from 'typescript'
import { $$and, $and, $or } from '../core/utils'
import { R } from '../lib/fp'
import { is } from '../lib/type'

const transformNode = (
  parent: string | null = null,
  key: string | 0 = 'data',
) => (type: Type<ts.Type>): string => {
  const name = is.null_(parent)
    ? (key as string)
    : key === 0
    ? `${parent}[0]`
    : `${parent}.${key}`

  if (type.isBoolean() && !type.isBooleanLiteral()) {
    return `${name} is bool`
  }

  if (type.isUnion()) {
    return P(type.getUnionTypes(), R.map(transformNode(parent, key)), $or)
  }

  if (type.isIntersection()) {
    return P(
      type.getIntersectionTypes(),
      R.map(transformNode(parent, key)),
      $and,
    )
  }

  const primitiveRuleExpression = type.isNull()
    ? $or([`${name} == null`, `!("${key}" in ${parent})`])
    : type.isLiteral()
    ? `${name} == ${type.getText()}`
    : type.isString()
    ? `${name} is string`
    : type.isNumber()
    ? $or([`${name} is int`, `${name} is float`])
    : type.getText().endsWith('.Timestamp')
    ? `${name} is timestamp`
    : null

  if (primitiveRuleExpression) {
    return primitiveRuleExpression
  }

  if (type.isArray()) {
    const elementType = type.getArrayElementTypeOrThrow()
    return $or([`${name}.size() == 0`, transformNode(name, 0)(elementType)])
  }

  if (type.isObject()) {
    return P(
      type.getProperties(),
      R.map((p) => {
        const valueDeclaration = p.getValueDeclarationOrThrow()
        return transformNode(name, p.getName())(valueDeclaration.getType())
      }),
      name === 'data' ? $$and : $and,
    )
  }

  throw new Error(`invalid type: ${type.getText()}`)
}

export const createCollectionSchemaOptionsNode = (
  typeArgument: TypeNode<ts.TypeNode>,
) => {
  const transformed = transformNode()(typeArgument.getType())

  const schemaOptionsObject = f.createObjectLiteralExpression([
    f.createPropertyAssignment('schema', f.createStringLiteral(transformed)),
  ])

  return schemaOptionsObject
}