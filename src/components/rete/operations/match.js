import Rete from "rete"
import { anySocket } from "../interfaces"
import { functionSocket } from "../function"
import { textSocket, TextControl } from "../text"

export const matchSocket = new Rete.Socket("Matcher")

export class MatchComponent extends Rete.Component {
  constructor() {
    super("Match")
  }

  builder(node) {
    const target = new Rete.Input("target", "Any", anySocket)
    const matcher = new Rete.Input("matcher", "Match Operator", textSocket)
    const func = new Rete.Input("func", "Function", functionSocket)
    const matchOp = new Rete.Output(
      "matchOp",
      "Match Operation",
      matchSocket,
      true
    )

    matcher.addControl(new TextControl(this.editor, "matcher", node))

    return node
      .addInput(target)
      .addInput(matcher)
      .addInput(func)
      .addOutput(matchOp)
  }

  worker(node, inputs, outputs) {
    const target = inputs.target.length ? inputs.target[0] : node.data.target
    const func = inputs.func.length ? inputs.func[0] : node.data.func

    outputs.matchOp = { target }
    if (func) {
      outputs.matchOp.func = func
    } else {
      const matcher = inputs.matcher.length
        ? inputs.matcher[0]
        : node.data.matcher

      switch (matcher) {
        case "is":
          outputs.matchOp.func = other => target === other
          break
        case "equals":
          outputs.matchOp.func = target.equals
            ? other => target.equals(other)
            : other => target == other
          break
        case "contains":
          outputs.matchOp.func = target.contains
            ? other => target.contains(other)
            : other => target.includes && target.includes(other)
          break
        case "has":
          outputs.matchOp.func = other => target.hasOwnProperty(other)
          break
        case "instanceof":
          outputs.matchOp.func = other => target instanceof other
          break
        default:
          outputs.matchOp.func = other =>
            target[matcher] && target[matcher](other)
          break
      }
    }
  }
}

export default MatchComponent
