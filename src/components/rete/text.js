import React from "react"
import Rete from "rete"
import { anySocket, joinableSocket } from "./interfaces"

export const textSocket = new Rete.Socket("Text")
textSocket.combineWith(anySocket)
textSocket.combineWith(joinableSocket)

export class TextControl extends Rete.Control {
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
    this.component = TextControl.component

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

export class TextComponent extends Rete.Component {
  constructor() {
    super("Text")

    this.nodeType = "Data"
  }

  builder(node) {
    const out = new Rete.Output("value", "Text", textSocket)
    const control = new TextControl(this.editor, "value", node)
    return node.addControl(control).addOutput(out)
  }

  worker(node, inputs, outputs) {
    outputs["value"] = node.data.value
  }
}

export default TextComponent
