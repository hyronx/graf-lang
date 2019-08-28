import Rete from "rete"
import { iterableSocket } from "../interfaces"
import { functionSocket } from "../function"

export class MapComponent extends Rete.Component {
  constructor() {
    super("Map")
  }

  builder(node) {
    const list = new Rete.Input("list", "List", iterableSocket)
    const func = new Rete.Input("func", "Function", functionSocket)
    const result = new Rete.Output("result", "Mapped List", iterableSocket)

    return node
      .addInput(list)
      .addInput(func)
      .addOutput(result)
  }

  worker(node, inputs, outputs) {
    const list = inputs.list.length ? inputs.list[0] : node.data.list
    const func = inputs.func.length ? inputs.func[0] : node.data.func
    outputs["result"] = list.map(func)
  }
}

export default MapComponent
