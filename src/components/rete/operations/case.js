import Rete from "rete"
import { anySocket } from "../interfaces"
import { matchSocket } from "./match"
import { TextControl } from "../text"

export class CaseComponent extends Rete.Component {
  constructor() {
    super("Case")
  }

  builder(node) {
    const matchOp = new Rete.Input("matchOp", "CaseMatcher", matchSocket)
    const comparator = new Rete.Input("comparator", "Comparator", anySocket)
    const result = new Rete.Output("result", "Matched Target", anySocket)

    comparator.addControl(new TextControl(this.editor, "comparator", node))

    return node
      .addInput(matchOp)
      .addInput(comparator)
      .addOutput(result)
  }

  worker(node, inputs, outputs) {
    const matchOp = inputs.matchOp.length
      ? inputs.matchOp[0]
      : node.data.matchOp
    const comparator = inputs.comparator.length
      ? inputs.comparator[0]
      : node.data.comparator
    if (matchOp.func(comparator)) outputs["result"] = matchOp.target
    else outputs["result"] = null
  }
}

export default CaseComponent
