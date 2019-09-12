// @flow

import Rete from "rete"
import { OperationTypeInfo } from "graf-core"

export const buildEditorView = (
  nodeData: OperationTypeInfo,
  editor: Rete.Editor
) => {
  const funcInput = editor.getComponent("Function Input")
  const funcOutput = editor.getComponent("Function Output")
  return Promise.all([
    ...nodeData.args.map(arg =>
      funcInput.createNode(arg).then(node => editor.addNode(node))
    ),
    funcOutput.createNode(nodeData.result).then(node => editor.addNode(node)),
  ])
}
