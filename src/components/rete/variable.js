import Rete from "rete"
import React from "react"
import Select from "react-select"
import { getTypes } from "graf-core"
import { anySocket } from "./interfaces"
import { TextControl, textSocket } from "./text"
import theme from "../../../config/theme"

export const variableSocket = new Rete.Socket("Variable")
variableSocket.combineWith(anySocket)

const backgroundColor = theme.colors.dark.default.paper

const selectStyles = {
  indicatorsContainer: styles => ({
    ...styles,
    height: "2rem",
    backgroundColor,
  }),
  control: styles => ({
    ...styles,
    height: "2rem",
    backgroundColor,
  }),
  valueContainer: styles => ({
    ...styles,
    height: "2rem",
    backgroundColor,
    color: "gold",
  }),
  menuList: styles => ({
    ...styles,
    backgroundColor,
  }),
  option: styles => ({
    ...styles,
    color: "white",
  }),
}

export class TypeControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <Select
      id={`type-select`}
      name={`type-select`}
      className="graf-type-select"
      isSearchable={true}
      isClearable={true}
      isDisabled={false}
      placeholder="Type"
      value={value}
      onChange={onChange}
      options={Object.entries(getTypes()).map(([name, def]) => ({
        label: name,
        value: def,
      }))}
      styles={selectStyles}
    />
  )

  constructor(emitter, key, node, readonly = false) {
    super(key)
    this.emitter = emitter
    this.key = key
    this.component = TypeControl.component

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

export class VariableComponent extends Rete.Component {
  constructor() {
    super("Variable")

    this.nodeType = "Meta"
  }

  builder(node) {
    const name = new Rete.Input("name", "Name", textSocket)
    const type = new Rete.Input("type", "Type", textSocket)
    const value = new Rete.Input("value", "Value", anySocket)
    const out = new Rete.Output("var", "Variable", variableSocket)

    name.addControl(new TextControl(this.editor, "name", node))
    type.addControl(new TypeControl(this.editor, "type", node))
    value.addControl(new TextControl(this.editor, "value", node))

    return node
      .addInput(name)
      .addInput(type)
      .addInput(value)
      .addOutput(out)
  }

  worker(node, inputs, outputs) {
    outputs["var"] = {
      name: inputs.name.length ? inputs.name[0] : node.data.name,
      type: inputs.type.length ? inputs.type[0] : node.data.type,
      value: inputs.value.length ? inputs.value[0] : node.data.value,
    }
  }
}

export default VariableComponent
