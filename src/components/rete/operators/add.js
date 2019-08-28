import Rete from "rete"
import { NumberControl, numberSocket } from "../number"
import { functionSocket } from "../function"

export class AddComponent extends Rete.Component {
  constructor() {
    super("Add")

    this.operation = (a, b) => a + b
  }

  builder(node) {
    const summands = new Rete.Input("summands", "Summands", numberSocket, true)
    const result = new Rete.Output("result", "Sum", numberSocket)
    const operation = new Rete.Output("operation", "Operation", functionSocket)

    const control = new NumberControl(this.editor, "preview", node, true)
    return node
      .addInput(summands)
      .addControl(control)
      .addOutput(result)
      .addOutput(operation)
  }

  worker(node, inputs, outputs) {
    if (inputs.summands.length >= 2) {
      const result = inputs.summands.reduce(this.operation)
      this.editor.nodes
        .find(n => n.id == node.id)
        .controls.get("preview")
        .setValue(result)
      outputs["result"] = result
    }
    outputs["operation"] = this.operation
  }
}

export default AddComponent
