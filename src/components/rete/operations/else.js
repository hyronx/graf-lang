import Rete from "rete"
import { anySocket } from "../interfaces"
import { matchSocket } from "./match"
import { TextControl } from "../text"

export class ElseComponent extends Rete.Component {
  constructor() {
    super("Else")
  }

  builder(node) {
    const matchOp = new Rete.Input("matchOp", "CaseMatcher", matchSocket)
    const result = new Rete.Output("result", "Matched Target", anySocket)

    return node.addInput(matchOp).addOutput(result)
  }

  worker(node, inputs, outputs) {
    const matchOp = inputs.matchOp.length
      ? inputs.matchOp[0]
      : node.data.matchOp
    outputs["result"] = matchOp.target
  }
}

export default ElseComponent
