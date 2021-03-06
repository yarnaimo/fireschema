import { dirname, relative, resolve } from 'path'
import { CallExpression, createWrappedNode } from 'ts-morph'
import ts, { factory } from 'typescript'
import { createCollectionSchemaOptionsNode } from './collection-schema'
import { transformJsonSchemaNode } from './json-schema'

const collectionSchema = '$collectionSchema'
const jsonSchema = '$jsonSchema'

const relativePath = relative(process.cwd(), __dirname)
const isInsideNodeModules = relativePath.startsWith('node_modules/')

export default function transformer(
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => (file: ts.SourceFile) =>
    visitNodeAndChildren(file, program, context)
}

function visitNodeAndChildren(
  node: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
): ts.SourceFile
function visitNodeAndChildren(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext,
): ts.Node | undefined
function visitNodeAndChildren(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext,
): ts.Node | undefined {
  const newNode = ts.visitEachChild(
    visitNode(node, program),
    (childNode) => visitNodeAndChildren(childNode, program, context),
    context,
  )

  if (
    newNode &&
    ts.isSourceFile(newNode) &&
    runtypesImportFlags.has(newNode.fileName)
  ) {
    const runtypesModulePath = isInsideNodeModules
      ? 'fireschema/dist/runtypes'
      : relative(dirname(newNode.fileName), resolve(__dirname, '../runtypes'))

    const requireNode = factory.createVariableStatement(
      [],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createObjectBindingPattern([
              factory.createBindingElement(undefined, '$_', '__$__'),
            ]),
            undefined,
            undefined,
            factory.createCallExpression(
              factory.createIdentifier('require'),
              undefined,
              [factory.createStringLiteral(runtypesModulePath)],
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    )

    return factory.updateSourceFile(newNode, [
      requireNode,
      ...newNode.statements,
    ])
  }

  return newNode
}

const runtypesImportFlags = new Map<string, boolean>()

function visitNode(node: ts.SourceFile, program: ts.Program): ts.SourceFile
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined {
  const typeChecker = program.getTypeChecker()
  //   if (isKeysImportExpression(node)) {
  //     return
  //   }
  const exp = ensureSchemaCallExpression(node, typeChecker)
  if (!exp) {
    return node
  }

  const wrappedExp = createWrappedNode(exp.node, {
    typeChecker,
  }) as CallExpression
  const [TType] = wrappedExp.getTypeArguments()
  if (!TType) {
    throw new Error('type argument not specified')
  }

  if (exp.type === collectionSchema) {
    const optionsNode = createCollectionSchemaOptionsNode(TType)

    return factory.createCallExpression(
      exp.node.expression,
      exp.node.typeArguments,
      [optionsNode],
    )
  } else {
    const file = node.getSourceFile()
    runtypesImportFlags.set(file.fileName, true)

    return transformJsonSchemaNode(TType)
  }
}

function ensureSchemaCallExpression(
  node: ts.Node,
  typeChecker: ts.TypeChecker,
) {
  if (!ts.isCallExpression(node)) {
    return false
  }

  const signature = typeChecker.getResolvedSignature(node)
  if (typeof signature === 'undefined') {
    return false
  }

  const { declaration } = signature
  const name =
    !!declaration &&
    !ts.isJSDocSignature(declaration) &&
    declaration.name?.getText()

  return name === collectionSchema
    ? ({ node, type: collectionSchema } as const)
    : name === jsonSchema
    ? ({ node, type: jsonSchema } as const)
    : null
}
