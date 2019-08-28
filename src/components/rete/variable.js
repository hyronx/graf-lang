import Rete from "rete"
import { anySocket } from "./interfaces"
import { TextControl, textSocket } from "./text"

export const variableSocket = new Rete.Socket("Variable")
variableSocket.combineWith(anySocket)

export class VariableComponent extends Rete.Component {
  constructor() {
    super("Variable")
  }

  builder(node) {
    const name = new Rete.Input("name", "Name", textSocket)
    const type = new Rete.Input("type", "Type", textSocket)
    const value = new Rete.Input("value", "Value", anySocket)
    const out = new Rete.Output("var", "Variable", variableSocket)

    name.addControl(new TextControl(this.editor, "name", node))
    type.addControl(new TextControl(this.editor, "type", node))
    value.addControl(new TextControl(this.editor, "value", node))

    return node
      .addInput(name)
      .addInput(type)
      .addInput(value)
      .addOutput(out)
  }

  worker(node, inputs, outputs) {
    outputs["var"] = {
      name: inputs.name.length ? inputs.name[0] : node.data.name,
      type: inputs.type.length ? inputs.type[0] : node.data.type,
      value: inputs.value.length ? inputs.value[0] : node.data.value,
    }
  }
}

export default VariableComponent
