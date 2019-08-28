import Rete from "rete"
import { anySocket } from "../interfaces"
import { TextControl } from "../text"

export class LogComponent extends Rete.Component {
  constructor() {
    super("Log")
  }

  builder(node) {
    const input = new Rete.Input("value", "Text", anySocket)
    const output = new Rete.Output("result", "Any", anySocket)
    const control = new TextControl(this.editor, "log", node, true)
    return node
      .addInput(input)
      .addControl(control)
      .addOutput(output)
  }

  worker(node, inputs, outputs) {
    const value = inputs.value.length ? inputs.value[0] : node.data.value
    console.log(value)

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("log")
      .setValue(value)
    outputs["result"] = value
  }
}

export default LogComponent
