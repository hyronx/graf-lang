import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Select from "react-select"
import getTypes from "../services/types"
import { Argument } from "../services/operation"
import ParameterField from "./parameter-field"

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

  border-radius: 0.8rem;
  border: 1px solid black;
  padding: 0.5em 0.5em 0.5em;
`

const CompactWrapper = styled.div`
  div.graf-class-prop {
    padding: 0 0.75rem;
    background-color: ${backgroundColor};
    border-radius: 0.25rem;
    border: 1px solid ${backgroundColor};
  }

  .graf-class-name {
    margin-right: 10px;
    font-weight: bold;
    color: gold;
  }

  .graf-class-type {
    margin: 0 10px;
    font-weight: bold;
    color: gold;
  }

  .graf-class-desc {
    margin: 0 10px;
    font-style: italic;
  }

  .graf-class-seperator {
    //padding: 0 0.5rem;
  }

  display: inline-grid;
  grid: 2rem / auto auto auto auto auto auto;
  text-align: center;
`

const ExtendedWrapper = styled.form`
  .graf-class-prop input {
    background-color: ${backgroundColor};
  }

  .graf-class-name {
    margin-bottom: 10px;
  }

  .graf-class-type {
    margin-bottom: 10px;
  }

  .graf-class-desc {
    margin-bottom: 10px;
  }
`

const CompactClassNotation = props => (
  <>
    <div className="graf-class-prop graf-class-name">
      <p>{props.className}</p>
    </div>
    <p className="graf-class-seperator">{" < "}</p>
    <div className="graf-class-prop graf-class-supertype">
      <p>{props.classSuperType}</p>
    </div>
    <p className="graf-class-seperator">{" - "}</p>
    <div className="graf-class-prop graf-class-desc">
      <p>{props.classDesc}</p>
    </div>
  </>
)

CompactClassNotation.propTypes = {
  className: PropTypes.string.isRequired,
  classSuperType: PropTypes.string.isRequired,
  classDesc: PropTypes.string.isRequired,
}

export const CompactClassField = props => (
  <CompactWrapper className="graf-class-compact">
    <i className="fas fa-caret-right icon-left" onClick={props.handleExtend} />
    <CompactClassNotation {...props} />
    {props.children}
  </CompactWrapper>
)

CompactClassField.propTypes = {
  className: PropTypes.string.isRequired,
  classSuperType: PropTypes.string.isRequired,
  classDesc: PropTypes.string.isRequired,
  handleExtend: PropTypes.func.isRequired,
  children: PropTypes.oneOf([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export const ExtendedClassField = props => (
  <ExtendedWrapper
    className="graf-class-extended"
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
    <CompactClassNotation {...props} />
    <div className={"graf-class-prop graf-class-name"}>
      <label htmlFor={`class-name-${props.index}`}>Parameter Name</label>
      <input
        type={"text"}
        name={`class-name-${props.index}`}
        id={`class-name-${props.index}`}
        disabled={!props.isEditable}
        placeholder={"Name"}
        maxLength={30}
        //autoFocus={this.state.isEditable}
        value={props.className}
        onChange={props.handleNameChange}
      />
    </div>
    <div className={"graf-class-prop graf-class-type"}>
      <label htmlFor={`class-type-${props.index}`}>Parameter Type</label>
      <Select
        id={`class-type-${props.index}`}
        name={`class-type-${props.index}`}
        isSearchable={true}
        isClearable={true}
        isDisabled={!props.isEditable}
        placeholder="Type"
        value={props.classSuperType}
        onChange={props.handleSuperTypeChange}
        options={ClassField.types}
        styles={{
          input: styles => ({
            ...styles,
            backgroundColor,
          }),
        }}
      />
    </div>
    <div className={"graf-class-prop graf-class-desc"}>
      <label htmlFor={`class-desc-${props.index}`}>Parameter Description</label>
      <input
        type={"text"}
        name={`class-desc-${props.index}`}
        id={`class-desc-${props.index}`}
        disabled={!props.isEditable}
        placeholder={"Description"}
        maxLength={30}
        value={props.classDesc}
        onChange={props.handleDescChange}
      />
    </div>
    {props.children}
  </ExtendedWrapper>
)

ExtendedClassField.propTypes = {
  index: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  classSuperType: PropTypes.string.isRequired,
  classDesc: PropTypes.string.isRequired,
  classValue: PropTypes.string,
  classTest: PropTypes.string,
  isEditable: PropTypes.bool.isRequired,
  isExtended: PropTypes.bool.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleSuperTypeChange: PropTypes.func.isRequired,
  handleDescChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleExtend: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOf([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

class ClassField extends React.Component {
  static types = getTypes().map(t => ({ label: t, value: t }))

  constructor(props) {
    super(props)

    this.state = {
      className: this.props.className || "",
      classDesc: this.props.classDesc || "",
      classSuperType: this.props.classSuperType || "",
      classGenerics: this.props.classGenerics || [],
      classInterfaces: this.props.classInterfaces || [],
      classMixins: this.props.classMixins || [],
      classProps: this.props.classProps || [],
      classMethods: this.props.classMethods || [],

      isEditable: false,
      isExtended: false,
    }
  }

  handleNameChange = event => {
    const { value } = event.target
    this.setState(() => ({
      className: value,
    }))
  }

  handleSuperTypeChange = (value, { action }) => {
    switch (action) {
      case "select-option":
      case "set-value":
        this.setState(() => ({
          classSuperType: value,
        }))
        break
      default:
        break
    }
  }

  handleDescChange = event => {
    const { value } = event.target
    this.setState(() => ({
      classDesc: value,
    }))
  }

  handleEdit = () => {
    this.setState(state => ({
      isEditable: !state.isEditable,
    }))
  }

  handleCancel = () => {}

  handleExtend = () => {
    this.setState(state => ({ isExtended: !state.isExtended }))
  }

  handleSubmit = async () => {
    await this.setState(state => ({
      isEditable: !state.isEditable,
    }))
    if (this.props.onUpdate) {
      const { className, classType, classDesc } = this.state
      this.props.onUpdate(className, classType, classDesc)
    }
  }

  render() {
    const props = this.state.classProps.map((prop, i) => (
      <ParameterField
        key={`class-${this.props.index}--prop-${i}`}
        index={i}
        paramName={prop.name}
        paramType={prop.type}
        paramDesc={prop.description}
      />
    ))
    return (
      <Wrapper className="graf-class boxed">
        {this.state.isExtended ? (
          <ExtendedClassField
            index={this.props.index}
            handleNameChange={this.handleNameChange}
            handleTypeChange={this.handleTypeChange}
            handleDescChange={this.handleDescChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExtend={this.handleExtend}
            {...this.state}
          >
            {props}
          </ExtendedClassField>
        ) : (
          <CompactClassField handleExtend={this.handleExtend} {...this.state}>
            {props}
          </CompactClassField>
        )}
      </Wrapper>
    )
  }
}

ClassField.propTypes = {
  index: PropTypes.number.isRequired,
  className: PropTypes.string,
  classSuperType: PropTypes.string,
  classDesc: PropTypes.string,
  classProps: PropTypes.arrayOf(PropTypes.instanceOf(Argument)),
  onUpdate: PropTypes.func,
}

export default ClassField
