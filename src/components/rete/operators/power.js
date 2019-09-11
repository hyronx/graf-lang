import Rete from "rete"
import { NumberControl, numberSocket } from "../number"

export class PowerComponent extends Rete.Component {
  constructor() {
    super("Power")

    this.nodeType = "Operator"
  }

  builder(node) {
    const first = new Rete.Input("first", "Base", numberSocket)
    const second = new Rete.Input("second", "Power", numberSocket)
    const out = new Rete.Output("result", "Product", numberSocket)

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
      .reduce((a, b) => Math.pow(a, b))

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(result)
    outputs["result"] = result
  }
}

export default PowerComponent
