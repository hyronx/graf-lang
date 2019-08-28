import React from "react"
import Rete from "rete"
import { anySocket } from "./interfaces"
import { variableSocket } from "./variable"

export const functionSocket = new Rete.Socket("Function")
functionSocket.combineWith(anySocket)

export class FunctionControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="text"
      value={value}
      ref={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation())
      }}
      onChange={e => onChange(String(e.target.value))}
    />
  )

  constructor(emitter, key, node, readonly = false) {
    super(key)
    this.emitter = emitter
    this.key = key
    this.component = FunctionControl.component

    const initial = node.data[key] || ""
    node.data[key] = initial
    this.props = {
      readonly,
      value: initial,
      onChange: value => {
        this.setValue(value)
        this.emitter.trigger("process")
      },
    }
  }

  setValue(value) {
    this.props.value = value
    this.putData(this.key, value)
    this.update()
  }
}

export class FunctionComponent extends Rete.Component {
  constructor() {
    super("Function")
  }

  builder(node) {
    const params = new Rete.Input("params", "Parameters", variableSocket, true)
    const operation = new Rete.Input(
      "operations",
      "Operations",
      functionSocket,
      true
    )
    const result = new Rete.Output("result", "Any", anySocket)
    const out = new Rete.Output("resultOperation", "Operation", functionSocket)
    return node
      .addInput(params)
      .addInput(operation)
      .addOutput(result)
      .addOutput(out)
  }

  worker(node, inputs, outputs) {
    const ops = inputs.operations.length
      ? inputs.operations
      : node.data.operations

    const resultOp = (...args) =>
      ops.reduce((params, op) => [op.apply(this, params)], args)[0]

    const paramValues = inputs.params
      .map(param => param.value)
      .filter(value => value !== undefined)

    if (paramValues.length > 0)
      outputs["result"] = resultOp.apply(this, paramValues)
    outputs["resultOperation"] = resultOp
  }
}

export default FunctionComponent
