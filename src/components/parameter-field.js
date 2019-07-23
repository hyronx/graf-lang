import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Wrapper = styled.form`
i.icon {
  float: right;
  margin-left: 10px;
} 

.graf-param-name {
  margin-bottom: 10px;
}

.graf-param-type {
  margin-bottom: 10px;
}

.graf-param-desc {
  margin-bottom: 10px;
}

display: inline-block;
border-radius: 10px;
border: 1px solid black;
padding: 10px;
`

class ParameterField extends React.Component {
  constructor(props) {
    super(props)

    this.handleParamNameChange = this.handleParamNameChange.bind(this)
    this.handleParamTypeChange = this.handleParamTypeChange.bind(this)
    this.handleParamDescChange = this.handleParamDescChange.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      paramName: "",
      paramType: "",
      paramDesc: "",

      prevParamName: "",
      prevParamType: "",
      prevParamDesc: "",

      isEditable: false,
    }
  }

  handleParamNameChange(event) {
    const { value } = event.target
    this.setState(state => ({
      paramName: value,
      prevParamName: state.paramName,
    }))
  }

  handleParamTypeChange(event) {
    const { value } = event.target
    this.setState(state => ({
      paramType: value,
      prevParamType: state.paramType,
    }))
  }

  handleParamDescChange(event) {
    const { value } = event.target
    this.setState(state => ({
      paramDesc: value,
      prevParamDesc: state.paramDesc,
    }))
  }

  handleEdit() {
    this.setState(state => ({
      isEditable: !state.isEditable,
    }))
  }

  handleCancel() {
    this.setState(state => ({
      paramName: state.prevParamName,
      paramType: state.prevParamType,
      paramDesc: state.prevParamDesc,
      isEditable: !state.isEditable,
    }))
  }

  async handleSubmit() {
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
      <Wrapper className={"graf-param boxed"} onSubmit={this.handleSubmit}>
        {this.state.isEditable ? (
          <div>
            <i className="fas fa-times icon" onClick={this.handleCancel}/>
            <i className="fas fa-check icon" onClick={this.handleSubmit}/>
          </div>
        ) : (
          <div>
            <i className="fas fa-trash-alt icon"/>
            <i className="fas fa-edit icon" onClick={this.handleEdit}/>
          </div>
        )}

        <h3>Parameter {this.props.index + 1}</h3>
        <div className={"graf-param-name"}>
          <label htmlFor={`param-name-${this.props.index}`}>
            Parameter Name
          </label>
          <input
            type={"text"}
            name={`param-name-${this.props.index}`}
            id={`param-name-${this.props.index}`}
            disabled={!this.state.isEditable}
            placeholder={"Name"}
            maxLength={30}
            autoFocus={this.state.isEditable}
            value={this.state.paramName}
            onChange={this.handleParamNameChange}
          />
        </div>
        <div className={"graf-param-type"}>
          <label htmlFor={`param-type-${this.props.index}`}>
            Parameter Type
          </label>
          <input
            type={"text"}
            name={`param-type-${this.props.index}`}
            id={`param-type-${this.props.index}`}
            disabled={!this.state.isEditable}
            placeholder={"Type"}
            maxLength={30}
            value={this.state.paramType}
            onChange={this.handleParamTypeChange}
          />
        </div>
        <div className={"graf-param-desc"}>
          <label htmlFor={`param-desc-${this.props.index}`}>
            Parameter Description
          </label>
          <input
            type={"text"}
            name={`param-desc-${this.props.index}`}
            id={`param-desc-${this.props.index}`}
            disabled={!this.state.isEditable}
            placeholder={"Description"}
            maxLength={30}
            value={this.state.paramDesc}
            onChange={this.handleParamDescChange}
          />
        </div>
      </Wrapper>
    )
  }
}

ParameterField.propTypes = {
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func,
}

export default ParameterField
