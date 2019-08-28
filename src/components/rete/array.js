import React from "react"
import Rete from "rete"
import styled from "styled-components"
import { anySocket, iterableSocket } from "./interfaces"

export const arraySocket = new Rete.Socket("Array")
arraySocket.combineWith(anySocket)
arraySocket.combineWith(iterableSocket)

const ListWrapper = styled.div`
  ul {
    overflow-block: scroll;
  }

  display: inline-block;
  width: 10em;
  height: 8em;
`

export class ArrayControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <ListWrapper>
      <ul>
        {value.map((e, i) => (
          <li key={`${value.join("")}-${i}`}>{e}</li>
        ))}
      </ul>
    </ListWrapper>
  )

  constructor(emitter, key, node, readonly = true) {
    super(key)
    this.emitter = emitter
    this.key = key
    this.component = ArrayControl.component

    const initial = node.data[key] || []
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

export class ArrayComponent extends Rete.Component {
  constructor() {
    super("Array")
  }

  builder(node) {
    const elements = new Rete.Input("elements", "Elements", anySocket, true)
    const result = new Rete.Output("result", "Array", arraySocket)

    const control = new ArrayControl(this.editor, "preview", node, true)
    return node
      .addInput(elements)
      .addControl(control)
      .addOutput(result)
  }

  worker(node, inputs, outputs) {
    const result = inputs.elements || node.data.elements

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(result)
    outputs["result"] = result
  }
}

export default ArrayComponent
