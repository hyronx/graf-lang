import React from "react"
import Rete from "rete"
import { anySocket, joinableSocket } from "./interfaces"

export const numberSocket = new Rete.Socket("Number")
numberSocket.combineWith(anySocket)
numberSocket.combineWith(joinableSocket)

export class NumberControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="number"
      value={value}
      ref={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation())
      }}
      onChange={e => onChange(+e.target.value)}
    />
  )

  constructor(emitter, key, node, readonly = false) {
    super(key)
    this.emitter = emitter
    this.key = key
    this.component = NumberControl.component

    const initial = node.data[key] || 0
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

export class NumberComponent extends Rete.Component {
  constructor() {
    super("Number")
  }

  builder(node) {
    const out = new Rete.Output("value", "Number", numberSocket)
    const control = new NumberControl(this.editor, "value", node)
    return node.addControl(control).addOutput(out)
  }

  worker(node, inputs, outputs) {
    outputs["value"] = node.data.value
  }
}

export default NumberComponent
