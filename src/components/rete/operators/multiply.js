import Rete from "rete"
import { NumberControl, numberSocket } from "../number"
import { functionSocket } from "../function"

export class MultiplyComponent extends Rete.Component {
  constructor() {
    super("Multiply")

    this.nodeType = "Operator"
    this.operation = (a, b) => a * b
  }

  builder(node) {
    const factors = new Rete.Input("factors", "Factors", numberSocket, true)
    const result = new Rete.Output("result", "Product", numberSocket)
    const operation = new Rete.Output("operation", "Operation", functionSocket)

    const control = new NumberControl(this.editor, "preview", node, true)
    return node
      .addInput(factors)
      .addControl(control)
      .addOutput(result)
      .addOutput(operation)
  }

  worker(node, inputs, outputs) {
    if (inputs.factors.length >= 2) {
      const result = inputs.factors.reduce(this.operation)
      this.editor.nodes
        .find(n => n.id == node.id)
        .controls.get("preview")
        .setValue(result)
      outputs.result = result
    }
    outputs.operation = this.operation
  }
}

export default MultiplyComponent
