import Rete from "rete"
import { NumberControl, numberSocket } from "../number"

export class DivideComponent extends Rete.Component {
  constructor() {
    super("Divide")
  }

  builder(node) {
    const first = new Rete.Input("first", "Dividend", numberSocket)
    const second = new Rete.Input("second", "Divisor", numberSocket)
    const out = new Rete.Output("result", "Quotient", numberSocket)

    const control = new NumberControl(this.editor, "preview", node, true)
    return node
      .addInput(first)
      .addInput(second)
      .addControl(control)
      .addOutput(out)
  }

  worker(node, inputs, outputs) {
    const result = [
      inputs.first.length ? inputs.first : node.data.first,
      inputs.second.length ? inputs.second : node.data.second,
    ]
      .flat()
      .reduce((a, b) => a / b)

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(result)
    outputs["result"] = result
  }
}

export default DivideComponent
