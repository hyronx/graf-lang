import Rete from "rete"
import { anySocket } from "../interfaces"
import { functionSocket } from "../function"

export class CallComponent extends Rete.Component {
  constructor() {
    super("Call")
  }

  builder(node) {
    const func = new Rete.Input("func", "Function", functionSocket)
    const params = new Rete.Input("params", "Parameters", anySocket, true)
    const result = new Rete.Output("result", "Result", anySocket)

    return node
      .addInput(func)
      .addInput(params)
      .addOutput(result)
  }

  worker(node, inputs, outputs) {
    const func = inputs.func.length ? inputs.func[0] : node.data.func
    const params = inputs.params.length ? inputs.params : node.data.params
    outputs["result"] = func.apply(func, params)
  }
}

export default CallComponent
