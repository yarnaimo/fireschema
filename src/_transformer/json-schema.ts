import { P } from 'lifts'
import { Type, TypeNode } from 'ts-morph'
import ts, { factory as f } from 'typescript'
import { R } from '../lib/fp'
import { $_ } from '../runtypes'

const create$ = (
  type: keyof typeof $_,
  argumentsArray: ts.Expression[] | null,
) => {
  const propertyAccessNode = f.createPropertyAccessExpression(
    f.createIdentifier('__$__'),
    type,
  )
  if (argumentsArray) {
    return f.createCallExpression(propertyAccessNode, undefined, argumentsArray)
  } else {
    return propertyAccessNode
  }
}

const reduceExpressions = (op: string) => (expressions: ts.Expression[]) => {
  return P(
    expressions,
    R.reduce((prev, cur): ts.Expression => {
      if (!prev) {
        return cur
      }
      return f.createCallExpression(
        f.createPropertyAccessExpression(prev, op),
        undefined,
        [cur],
      )
    }, null as ts.Expression | null),
    (expression) => expression as ts.Expression,
  )
}

const transformNode = (type: Type<ts.Type>): ts.Expression => {
  if (type.isBoolean() && !type.isBooleanLiteral()) {
    return create$('Boolean', null)
  }

  if (type.isUnion()) {
    const types = type.getUnionTypes()
    const hasUndefined = types.some((t) => t.isUndefined())

    const unionExpression = create$('Union', P(types, R.map(transformNode)))

    return hasUndefined
      ? create$('Optional', [unionExpression])
      : unionExpression
  }

  if (type.isIntersection()) {
    const types = type.getIntersectionTypes()
    return create$('Intersect', P(types, R.map(transformNode)))
  }

  const primitiveRuntypeExpression = type.isUndefined()
    ? create$('Undefined', null)
    : type.isNull()
    ? create$('Null', null)
    : type.isLiteral()
    ? create$('Literal', [f.createIdentifier(type.getText())])
    : type.isString()
    ? create$('String', null)
    : type.isNumber()
    ? create$('Number', null)
    : null

  if (primitiveRuntypeExpression) {
    return primitiveRuntypeExpression
  }

  if (type.isArray()) {
    const elementType = type.getArrayElementTypeOrThrow()
    return create$('Array', [transformNode(elementType)])
  }

  if (type.isObject()) {
    return P(
      type.getProperties(),
      R.map((p) => {
        const type = p.getDeclarations()[0].getType()
        return f.createPropertyAssignment(p.getName(), transformNode(type))
      }),
      f.createObjectLiteralExpression,
      (objectExpression) => create$('Record', [objectExpression]),
    )
  }

  throw new Error(`invalid type: ${type.getText()}`)
}

export const transformJsonSchemaNode = (
  typeArgument: TypeNode<ts.TypeNode>,
) => {
  const transformed = transformNode(typeArgument.getType())
  return transformed
}
