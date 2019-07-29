import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Select from "react-select"
import getTypes from "../services/types"
//import styles from "../assets/css/main.css"

const backgroundColor = "#21232b"

const Wrapper = styled.div`
  i {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-content: center;
    align-content: center;
  }

  .icon-left {
    float: left;
    margin-right: 1em;
  }

  .icon-right {
    float: right;
    margin-left: 10px;
  }
  
  h3, label, input, p, .graf-type-select {
    font-size: medium;
  }

  border-radius: 0.8rem;
  border: 1px solid black;
  padding: 0.5em 0.5em 0.5em;
`

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

export const CompactParameterField = props => (
  <CompactWrapper className="graf-param-compact">
    <i className="fas fa-caret-right icon-left" onClick={props.handleExtend} />
    <div className="graf-param-prop graf-param-name">
      <p>{props.paramName}</p>
    </div>
    <p className="graf-param-seperator">{" : "}</p>
    <div className="graf-param-prop graf-param-type">
      <p>{props.paramType}</p>
    </div>
    <p className="graf-param-seperator">{" - "}</p>
    <div className="graf-param-prop graf-param-desc">
      <p>{props.paramDesc}</p>
    </div>
  </CompactWrapper>
)

CompactParameterField.propTypes = {
  index: PropTypes.number.isRequired,
  paramName: PropTypes.string.isRequired,
  paramType: PropTypes.string.isRequired,
  paramDesc: PropTypes.string.isRequired,
  paramValue: PropTypes.string,
  paramTest: PropTypes.string,
  handleExtend: PropTypes.func.isRequired,
}

export const ExtendedParameterField = props => (
  <ExtendedWrapper
    className="graf-param-extended"
    onSubmit={props.handleSubmit}
  >
    {props.isEditable ? (
      <div>
        <i className="fas fa-times icon-right" onClick={props.handleCancel} />
        <i className="fas fa-check icon-right" onClick={props.handleSubmit} />
      </div>
    ) : (
      <div>
        <i className="fas fa-trash-alt icon-right" />
        <i className="fas fa-edit icon-right" onClick={props.handleEdit} />
      </div>
    )}

    <i className="fas fa-caret-down icon-left" onClick={props.handleExtend} />
    <h3>Parameter {props.index + 1}</h3>
    <div className={"graf-param-prop graf-param-name"}>
      <label htmlFor={`param-name-${props.index}`}>Parameter Name</label>
      <input
        type={"text"}
        name={`param-name-${props.index}`}
        id={`param-name-${props.index}`}
        disabled={!props.isEditable}
        placeholder={"Name"}
        maxLength={30}
        //autoFocus={this.state.isEditable}
        value={props.paramName}
        onChange={props.handleParamNameChange}
      />
    </div>
    <div className={"graf-param-prop graf-param-type"}>
      <label htmlFor={`param-type-${props.index}`}>Parameter Type</label>
      <Select
        id={`param-type-${props.index}`}
        name={`param-type-${props.index}`}
        isSearchable={true}
        isClearable={true}
        isDisabled={!props.isEditable}
        placeholder="Type"
        value={props.paramType}
        onChange={props.handleParamTypeChange}
        options={ParameterField.types}
        styles={{
          indicatorsContainer: styles => ({
            ...styles,
            height: "2rem",
          }),
          control: styles => ({
            ...styles,
            height: "2rem",
          }),
          valueContainer: styles => ({
            ...styles,
            height: "2rem",
          })
        }}
      />
    </div>
    <div className={"graf-param-prop graf-param-desc"}>
      <label htmlFor={`param-desc-${props.index}`}>Parameter Description</label>
      <input
        type={"text"}
        name={`param-desc-${props.index}`}
        id={`param-desc-${props.index}`}
        disabled={!props.isEditable}
        placeholder={"Description"}
        maxLength={30}
        value={props.paramDesc}
        onChange={props.handleParamDescChange}
      />
    </div>
  </ExtendedWrapper>
)

ExtendedParameterField.propTypes = {
  index: PropTypes.number.isRequired,
  paramName: PropTypes.string.isRequired,
  paramType: PropTypes.string.isRequired,
  paramDesc: PropTypes.string.isRequired,
  paramValue: PropTypes.string,
  paramTest: PropTypes.string,
  isEditable: PropTypes.bool.isRequired,
  isExtended: PropTypes.bool.isRequired,
  handleParamNameChange: PropTypes.func.isRequired,
  handleParamTypeChange: PropTypes.func.isRequired,
  handleParamDescChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleExtend: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

class ParameterField extends React.Component {
  static types = getTypes().map(t => ({ label: t, value: t }))

  constructor(props) {
    super(props)

    this.state = {
      paramName: this.props.paramName || "",
      paramType: this.props.paramType || "",
      paramDesc: this.props.paramDesc || "",

      prevParamName: "",
      prevParamType: "",
      prevParamDesc: "",

      isEditable: false,
      isExtended: false,
    }
  }

  handleParamNameChange = event => {
    const { value } = event.target
    this.setState(state => ({
      paramName: value,
      prevParamName: state.paramName,
    }))
  }

  handleParamTypeChange = (value, { action }) => {
    switch (action) {
      case "select-option":
      case "set-value":
        this.setState(state => ({
          paramType: value,
          prevParamType: state.paramType,
        }))
        break
      default:
        break
    }
  }

  handleParamDescChange = event => {
    const { value } = event.target
    this.setState(state => ({
      paramDesc: value,
      prevParamDesc: state.paramDesc,
    }))
  }

  handleEdit = () => {
    this.setState(state => ({
      isEditable: !state.isEditable,
    }))
  }

  handleCancel = () => {
    this.setState(state => ({
      paramName: state.prevParamName,
      paramType: state.prevParamType,
      paramDesc: state.prevParamDesc,
      isEditable: !state.isEditable,
    }))
  }

  handleExtend = () => {
    this.setState(state => ({ isExtended: !state.isExtended }))
  }

  handleSubmit = async () => {
    await this.setState(state => ({
      isEditable: !state.isEditable,
    }))
    if (this.props.onUpdate) {
      const { paramName, paramType, paramDesc } = this.state
      this.props.onUpdate(paramName, paramType, paramDesc)
    }
  }

  render() {
    return (
      <Wrapper className="graf-param boxed">
        {this.state.isExtended ? (
          <ExtendedParameterField
            index={this.props.index}
            handleParamNameChange={this.handleParamNameChange}
            handleParamTypeChange={this.handleParamTypeChange}
            handleParamDescChange={this.handleParamDescChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExtend={this.handleExtend}
            {...this.state}
          />
        ) : (
          <CompactParameterField
            handleExtend={this.handleExtend}
            {...this.state}
          />
        )}
      </Wrapper>
    )
  }
}

ParameterField.propTypes = {
  index: PropTypes.number.isRequired,
  paramName: PropTypes.string,
  paramType: PropTypes.string,
  paramDesc: PropTypes.string,
  paramValue: PropTypes.string,
  paramTest: PropTypes.string,
  onUpdate: PropTypes.func,
}

export default ParameterField
