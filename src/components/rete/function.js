import React from "react"
import Rete from "rete"
import { anySocket } from "./interfaces"
import { variableSocket } from "./variable"
import { TextControl } from "./text"

const windowGlobal = typeof window !== "undefined" ? window : undefined

export const functionSocket = new Rete.Socket("Function")
functionSocket.combineWith(anySocket)
functionSocket.combineWith(variableSocket)

export class FunctionComponent extends Rete.Component {
  constructor() {
    super("Function")

    this.nodeType = "Meta"
    this.module = {
      nodeType: "module",
    }
  }

  builder(node) {
    const control = new TextControl(this.editor, "module", {
      data: { module: "Function name..." },
    })
    control.onChange = () => {
      this.updateModuleSockets(node)
      node.update()
    }
    return node.addControl(control)
  }

  change(node, item) {
    node.data.module = item
    this.editor.trigger("process")
  }
}

export class FunctionInputComponent extends Rete.Component {
  constructor() {
    super("Function Input")

    this.nodeType = "Meta"
    this.module = {
      nodeType: "input",
      socket: anySocket,
    }
  }

  builder(node) {
    const out = new Rete.Output("output", "Value", anySocket)
    const control = new TextControl(this.editor, "name", { data: {} })
    const dataControl = new TextControl(this.editor, "value", {
      type: "any",
      value: "",
      data: {},
    })

    return node
      .addControl(control)
      .addControl(dataControl)
      .addOutput(out)
  }

  async worker(node, inputs, outputs) {
    if (!outputs["value"]) outputs["value"] = node.data.value
  }
}

export class FunctionOutputComponent extends Rete.Component {
  constructor() {
    super("Function Output")

    this.nodeType = "Meta"
    this.module = {
      nodeType: "output",
    }
  }

  builder(node) {
    const input = new Rete.Input("input", "Any", anySocket)
    const control = new TextControl(this.editor, "name", { data: {} })

    return node.addControl(control).addInput(input)
  }
}

export default FunctionComponent
