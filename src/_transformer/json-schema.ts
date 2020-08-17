import { P } from 'lifts'
import { Type, TypeNode } from 'ts-morph'
import ts, { factory as f } from 'typescript'
import { R } from '../lib/fp'
import { $ } from '../runtypes'

const create$ = (
  type: keyof typeof $,
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
    return P(
      type.getUnionTypes(),
      R.map(transformNode),
      reduceExpressions('Or'),
    )
  }

  if (type.isIntersection()) {
    return P(
      type.getIntersectionTypes(),
      R.map(transformNode),
      reduceExpressions('And'),
    )
  }

  const primitiveRuntypeExpression = type.isNull()
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
