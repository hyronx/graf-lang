import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { FieldWrapper, CompactField, ExtendedField } from "./field"
import theme from "../../config/theme"

const backgroundColor = theme.colors.dark.default.paper

const ExtendedWrapper = styled.form`
  .graf-param-prop input {
    max-height: 2rem;
    background-color: ${backgroundColor};
  }

  .graf-param-prop {
    margin-bottom: 1rem;
  }
`

const CompactWrapper = styled.div`
  div.graf-param-prop {
    padding: 0 0.75rem;
    background-color: ${backgroundColor};
    border-radius: 0.25rem;
    border: 1px solid ${backgroundColor};
  }

  .graf-param-name {
    margin-right: 10px;
    font-weight: bold;
  }

  .graf-param-type {
    margin: 0 10px;
    font-weight: bold;
    color: gold;
  }

  .graf-param-desc {
    margin: 0 10px;
    font-style: italic;
  }

  .graf-param-seperator {
    //padding: 0 0.5rem;
  }

  display: inline-grid;
  grid: 2rem / auto auto auto auto auto auto;
  text-align: center;
`

class ParameterField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name || "",
      type: this.props.type || "",
      description: this.props.description || "",

      prevParamName: "",
      prevParamType: "",
      prevParamDesc: "",

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
      this.props.onUpdate
        ? () => this.props.onUpdate(Object.assign({}, this.state), this)
        : undefined
    )
  }

  render() {
    return (
      <FieldWrapper
        className={`graf-param active ${this.props.isBoxed ? "box" : ""}`}
      >
        {this.state.isExpanded ? (
          <ExtendedField
            index={this.props.index}
            prefix={"param"}
            wrapper={ExtendedWrapper}
            title={props => <h3>Parameter {props.index}</h3>}
            handleChange={this.handleChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExpand={this.handleExpand}
            {...this.state}
          />
        ) : (
          <CompactField
            index={this.props.index}
            prefix={"param"}
            wrapper={CompactWrapper}
            props={[
              { name: "name", label: this.state.name },
              { seperator: ":" },
              { name: "type", label: this.state.type },
              { seperator: "–" },
              { name: "desc", label: this.state.description },
            ]}
          />
        )}
      </FieldWrapper>
    )
  }
}

ParameterField.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.string,
  test: PropTypes.string,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isBoxed: PropTypes.bool,
  onExpand: PropTypes.func,
  onUpdate: PropTypes.func,
}

ParameterField.defaultProps = {
  isExpanded: false,
}

export default ParameterField
