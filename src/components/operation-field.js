import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Argument } from "graf-core"
import { FieldWrapper, CompactField, ExtendedField } from "./field"
import ParameterField from "./parameter-field"
import AddButton from "./add-button"
import theme from "../../config/theme"

const backgroundColor = theme.colors.dark.default.paper

const ExtendedWrapper = styled.form`
  .graf-op-prop input {
    max-height: 2rem;
    background-color: ${backgroundColor};
  }

  .graf-op-prop {
    margin-bottom: 1rem;
  }

  .graf-op-add-param {
    margin: 1rem 0;
  }
`

const CompactWrapper = styled.div`
  div.graf-op-prop {
    padding: 0 0.75rem;
    background-color: ${backgroundColor};
    border-radius: 0.25rem;
    border: 1px solid ${backgroundColor};
  }

  .graf-op-name {
    margin-right: 10px;
    font-weight: bold;
  }

  .graf-op-type {
    margin: 0 10px;
    font-weight: bold;
    color: gold;
  }

  .graf-op-desc {
    margin: 0 10px;
    font-style: italic;
  }

  .graf-op-seperator {
    //padding: 0 0.5rem;
  }

  display: inline-grid;
  grid: 2rem / auto auto auto auto auto auto;
  text-align: center;
`

class OperationField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name || "",
      type: this.props.type || "",
      description: this.props.description || "",
      args: this.props.args || [],
      paramFields: this.props.paramFields || [],
      isParamFieldExpanded: true,

      isEditable: this.props.isEditable,
      isExpanded: this.props.isExpanded,
    }
  }

  handleChange = (source, event, data) => {
    switch (source) {
      case "type":
        this.handleTypeChange(event, data)
        break
      default:
        this.setState({ [source]: event.target.value })
        break
    }
  }

  handleTypeChange = ({ value }, { action }) => {
    switch (action) {
      case "select-option":
      case "set-value":
        this.setState({ type: value })
        break
      default:
        break
    }
  }

  handleEdit = () => {
    this.setState(state => ({
      isEditable: !state.isEditable,
    }))
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
      this.props.onUpdate ? () => this.props.onUpdate(this.state) : undefined
    )
  }

  addParamField = () => {
    this.setState(state => ({
      paramFields: [
        ...state.paramFields,
        <ParameterField
          key={`graf-op-param-${state.args.length}`}
          index={state.args.length}
          isEditable={true}
          isExpanded={state.isParamFieldExpanded}
          isBoxed={true}
          onUpdate={(paramState, paramField) => {
            this.setState(state => ({
              args: [
                ...state.args,
                new Argument(
                  paramState.name,
                  paramState.type,
                  undefined,
                  paramState.description
                ),
              ],
            }))
            paramField.isExpanded = false
          }}
        />,
      ],
    }))
  }

  render() {
    return (
      <FieldWrapper
        className={`graf-op active ${this.props.isBoxed ? "boxed" : ""}`}
      >
        {this.props.isExpanded ? (
          <ExtendedField
            index={this.props.index}
            prefix={"op"}
            wrapper={ExtendedWrapper}
            title={props => <h3>Operation {props.index}</h3>}
            handleChange={this.handleChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExpand={this.handleExpand}
            {...this.state}
          >
            {[
              <label key="graf-op-params-label" htmlFor="graf-op-add-param">
                Op Parameters
              </label>,
              ...this.state.paramFields,
              <AddButton
                key="graf-op-add-param"
                id="graf-op-add-param"
                name="graf-op-add-param"
                className="graf-op-add-param button"
                label="Parameter"
                onClick={this.addParamField}
              />,
            ]}
          </ExtendedField>
        ) : (
          <CompactField
            index={this.props.index}
            prefix={"op"}
            wrapper={CompactWrapper}
            props={[
              { name: "name", label: this.state.name },
              { seperator: "(" },
            ]
              .concat(
                this.props.args.flatMap((a, i) => [
                  { name: `arg-${i}`, label: a.name },
                  { seperator: ":" },
                  { name: `type-${i}`, label: a.type },
                ])
              )
              .concat([
                { seperator: "):" },
                { name: "type", label: this.state.type },
              ])}
          />
        )}
      </FieldWrapper>
    )
  }
}

OperationField.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  args: PropTypes.array,
  paramFields: PropTypes.array,
  test: PropTypes.string,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isBoxed: PropTypes.bool,
  onExpand: PropTypes.func,
  onUpdate: PropTypes.func,
}

OperationField.defaultProps = {
  isExpanded: false,
}

export default OperationField
