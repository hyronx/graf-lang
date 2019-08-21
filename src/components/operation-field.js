import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Argument, TestSet } from "graf-core"
import { FieldWrapper, CompactField, ExtendedField } from "./field"
import ParameterField from "./parameter-field"
import TestSetField from "./testset-field"
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

  width: 18em;
`

const CompactWrapper = styled.div`
  div.graf-op-prop {
    padding: 0 0.75rem;
    background-color: ${backgroundColor};
    border-radius: 0.25rem;
    border: 1px solid ${backgroundColor};
  }

  .graf-op-name,
  div[class*="graf-op-arg"] {
    margin-right: 10px;
    font-weight: bold;
  }

  div[class*="graf-op-type"] {
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
  grid: 1em / ${props => "auto ".repeat(props.props.length)};
  text-align: center;
  //width: 20em;
`

class OperationField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name || "",
      type: this.props.type || "",
      description: this.props.description || "",
      args: this.props.args || [],
      testSets: this.props.testSets || [],
      paramFields: this.props.paramFields || [],
      testSetFields: this.props.testSetFields || [],
      isParamFieldExpanded: true,
      isAddParamDisabled: false,
      isAddTestSetDisabled: false,

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

  addParamField = () => {
    if (!this.state.isAddParamDisabled) {
      this.setState(state => ({
        isAddParamDisabled: !state.isAddParamDisabled,
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
    } else {
      this.setState(state => ({
        isAddParamDisabled: state.paramFields.length !== state.args.length,
        isAddTestSetDisabled: state.paramFields.length !== state.args.length,
      }))
    }
  }

  addTestSetField = () => {
    if (!this.state.isAddTestSetDisabled) {
      this.setState(state => ({
        isAddTestSetDisabled: !state.isAddTestSetDisabled,
        testSetFields: [
          ...state.testSetFields,
          <TestSetField
            key={`graf-op-testset-${state.testSets.length}`}
            index={state.testSets.length}
            inputs={state.args}
            output={state.result}
            isEditable={true}
            isExpanded={state.isParamFieldExpanded}
            isBoxed={true}
            onUpdate={(testSetState, testSetField) => {
              this.setState(state => ({
                testSets: [
                  ...state.testSets,
                  new TestSet(testSetState.output, testSetState.inputs),
                ],
              }))
              testSetField.isExpanded = false
            }}
          />,
        ],
      }))
    } else {
      this.setState(state => ({
        isAddParamDisabled:
          state.testSetFields.length !== state.testSets.length,
        isAddTestSetDisabled:
          state.testSetFields.length !== state.testSets.length,
      }))
    }
  }

  render() {
    return (
      <FieldWrapper
        className={`graf-op active ${this.props.isBoxed ? "box" : ""}`}
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
            {this.props.showParams
              ? [
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
                    disabled={this.state.isAddParamDisabled}
                  />,
                  <label
                    key="graf-op-testsets-label"
                    htmlFor="graf-op-add-testset"
                  >
                    Op Test Sets
                  </label>,
                  ...this.state.testSetFields,
                  <AddButton
                    key="graf-op-add-testset"
                    id="graf-op-add-testset"
                    name="graf-op-add-testset"
                    className="graf-op-add-testset button"
                    label="Test set"
                    onClick={this.addTestSetField}
                    disabled={this.state.isAddTestSetDisabled}
                  />,
                ]
              : []}
          </ExtendedField>
        ) : (
          <CompactField
            index={this.props.index}
            prefix={"op"}
            wrapper={CompactWrapper}
            props={[
              { name: "name", label: this.state.name },
              { seperator: "(" },
              ...(() => {
                const args = this.props.args.flatMap((a, i) => [
                  { name: `arg-${i}`, label: a.name },
                  { seperator: ":" },
                  { name: `type-${i}`, label: a.type },
                  { seperator: "," },
                ])
                args.pop()
                return args
              })(),
              { seperator: "):" },
              { name: "type", label: this.state.type },
            ]}
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
  testSets: PropTypes.array,
  paramFields: PropTypes.arrayOf(PropTypes.element),
  testSetFields: PropTypes.arrayOf(PropTypes.element),
  test: PropTypes.string,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isBoxed: PropTypes.bool,
  showParams: PropTypes.bool,
  onExpand: PropTypes.func,
  onUpdate: PropTypes.func,
  onEdit: PropTypes.func,
}

OperationField.defaultProps = {
  isExpanded: false,
  showParams: false,
  isBoxed: true,
}

export default OperationField
