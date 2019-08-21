import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Argument } from "graf-core"
import { FieldWrapper, CompactField, ExtendedField } from "./field"
import theme from "../../config/theme"

const backgroundColor = theme.colors.dark.default.paper

const ExtendedWrapper = styled.form`
  .graf-testset-prop input {
    max-height: 2rem;
    background-color: ${backgroundColor};
  }

  .graf-testset-prop {
    margin-bottom: 1rem;
  }
`

const CompactWrapper = styled.div`
  div.graf-testset-prop {
    padding: 0 0.75rem;
    background-color: ${backgroundColor};
    border-radius: 0.25rem;
    border: 1px solid ${backgroundColor};
  }

  .graf-testset-prop {
    margin-right: 10px;
    font-weight: bold;
  }

  .graf-testset-output {
    margin: 0 10px;
    font-style: bold;
  }

  .graf-testset-seperator {
    //padding: 0 0.5rem;
  }

  display: inline-grid;
  grid: 2rem / auto auto auto auto auto auto;
  text-align: center;
`

class TestSetField extends React.Component {
  constructor(props) {
    super(props)

    let inputs = this.props.inputs || []
    if (inputs.length > 0 && inputs[0] instanceof Argument) {
      inputs = inputs.map(input => [input, input.value])
    } else if (inputs.length > 0 && !Array.isArray(inputs[0])) {
      throw new Error("Illegal prop type for inputs")
    }

    this.state = {
      inputs,
      output: this.props.output,
      isEditable: this.props.isEditable,
      isExpanded: this.props.isExpanded,
    }
  }

  async shouldComponentUpdate(nextProps) {
    if (nextProps !== this.props) {
      await this.setState(state => ({ ...state, ...nextProps }))
    }

    return true
  }

  get isExpanded() {
    return this.state.isExpanded
  }

  set isExpanded(value) {
    this.setState({
      isExpanded: value,
    })
  }

  handleChange = (source, event, data) => {
    const value = event.target.value
    if (source.startsWith("input")) {
      this.setState(state => {
        const inputName = source.split("-", 2)[1]
        const input = state.inputs.find(([input]) => input.name === inputName)
        input[1] = value
        return {
          inputs: state.inputs,
          [source]: value,
        }
      })
    } else if (source === "output") {
      this.setState({ output: value })
    }
  }

  handleEdit = () => {
    this.setState(
      state => ({
        isEditable: !state.isEditable,
      }),
      this.props.onEdit
        ? () =>
            this.props.onEdit(
              {
                ...this.props,
                ...this.state,
              },
              this.state
            )
        : undefined
    )
  }

  handleCancel = () => {
    this.setState(state => ({
      name: state.prevParamName,
      type: state.prevParamType,
      description: state.prevParamDesc,
      isEditable: !state.isEditable,
    }))
  }

  handleExpand = () => {
    this.setState(
      state => ({ isExpanded: !state.isExpanded }),
      this.props.onExpand
    )
  }

  handleSubmit = () => {
    this.setState(
      state => ({
        isEditable: !state.isEditable,
      }),
      this.props.onUpdate
        ? () =>
            this.props.onUpdate(
              {
                ...this.props,
                ...this.state,
              },
              this.state
            )
        : undefined
    )
  }

  mapInputs() {
    const inputs = this.state.inputs.flatMap(([input, value]) => [
      { name: input.name, label: value },
      { seperator: "," },
    ])
    inputs.pop()
    return inputs.concat([
      { seperator: "≟" },
      { name: "output", label: this.state.output },
    ])
  }

  render() {
    return (
      <FieldWrapper
        className={`graf-testset active ${this.props.isBoxed ? "box" : ""}`}
      >
        {this.state.isExpanded ? (
          <ExtendedField
            index={this.props.index}
            prefix={"testset"}
            wrapper={ExtendedWrapper}
            title={props => <h3>Test Set {props.index}</h3>}
            handleChange={this.handleChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExpand={this.handleExpand}
            withoutStandardChildren={true}
            {...this.state}
          >
            {[
              ...this.state.inputs.map(([input]) => ({
                name: `input-${input.name}`,
                label: `Test Input for ${input.name}`,
                placeholder: "Test Input Value",
              })),
              {
                name: "output",
                label: "Expected Output",
                placeholder: "Expected Result",
              },
            ]}
          </ExtendedField>
        ) : (
          <CompactField
            index={this.props.index}
            prefix={"testset"}
            wrapper={CompactWrapper}
            props={this.mapInputs()}
          />
        )}
      </FieldWrapper>
    )
  }
}

TestSetField.propTypes = {
  index: PropTypes.number.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Argument)])
  ).isRequired,
  output: PropTypes.any.isRequired,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isBoxed: PropTypes.bool,
  onExpand: PropTypes.func,
  onUpdate: PropTypes.func,
  onEdit: PropTypes.func,
}

TestSetField.defaultProps = {
  isExpanded: false,
  isBoxed: true,
}

export default TestSetField
