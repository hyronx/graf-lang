import React from "react"
import Rete from "rete"
import { anySocket } from "./interfaces"
import { functionSocket } from "./function"
import { variableSocket } from "./variable"
import { TextControl } from "./text"

const windowGlobal = typeof window !== "undefined" ? window : undefined

export const refSocket = new Rete.Socket("Reference")
refSocket.combineWith(anySocket)
refSocket.combineWith(functionSocket)
refSocket.combineWith(variableSocket)

export class ReferenceComponent extends Rete.Component {
  constructor() {
    super("Reference")

    this.nodeType = "Meta"
  }

  builder(node) {
    const out = new Rete.Output("ref", "Reference to object", refSocket)
    const control = new TextControl(this.editor, "name", node)
    return node.addControl(control).addOutput(out)
  }

  worker(node, inputs, outputs) {
    const splittedName = node.data.name.split(".")
    let currentPart = windowGlobal[splittedName[0]]
    for (let i = 1; i < splittedName.length; i++) {
      const possiblePart = currentPart[splittedName[i]]
      currentPart =
        possiblePart === undefined
          ? currentPart["prototype"][splittedName[i]]
          : possiblePart
    }

    outputs.ref = currentPart
  }
}

export default ReferenceComponent
