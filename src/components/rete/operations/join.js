import Rete from "rete"
import { joinableSocket } from "../interfaces"
import { TextControl } from "../text"

export class JoinComponent extends Rete.Component {
  constructor() {
    super("Join")
  }

  builder(node) {
    const summands = new Rete.Input("summands", "Parts", joinableSocket, true)
    const out = new Rete.Output("result", "Result", joinableSocket)

    const control = new TextControl(this.editor, "preview", node, true)
    return node
      .addInput(summands)
      .addControl(control)
      .addOutput(out)
  }

  worker(node, inputs, outputs) {
    const result = [
      inputs.summands.length ? inputs.summands : node.data.summands,
    ]
      .flat(1)
      .reduce((a, b) => {
        if (Array.isArray(a)) return a.concat(Array.isArray(b) ? b : [b])
        else return a + b
      })

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(result)
    outputs["result"] = result
  }
}

export default JoinComponent
