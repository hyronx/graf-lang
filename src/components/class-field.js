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
  
  h3, label, input, p, .graf-type-select {
    font-size: medium;
  }
  
  .graf-class-props-container {
    margin: 2rem 0;
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

  .graf-class-supertype {
    margin: 0 10px;
    font-weight: bold;
    color: gold;
  }

  .graf-class-desc {
    margin: 0 10px;
    font-style: italic;
  }

  .graf-class-separator {
    //padding: 0 0.5rem;
  }
`

const ExtendedWrapper = styled.form`
  .graf-class-prop input {
    max-height: 2rem;
    background-color: ${backgroundColor};
  }
  
  .graf-class-prop {
    margin-bottom: 1rem;
  }

  .graf-class-name {
    font-weight: bold;
    color: gold;
  }

  .graf-class-supertype {
    font-weight: bold;
    color: gold;
  }
`

const NotationWrapper = styled.div`
  display: inline-grid;
  grid: 2rem / auto auto auto auto auto auto;
  text-align: center;
`

export const CompactClassField = props => (
  <CompactWrapper className="graf-class-compact">
    <i className="fas fa-caret-right icon-left" onClick={props.handleExtend} />
    <NotationWrapper>
      <div className="graf-class-prop graf-class-name">
        <p>{props.className}</p>
      </div>
      <p className="graf-class-separator">{" < "}</p>
      <div className="graf-class-prop graf-class-supertype">
        <p>{props.classSuperType}</p>
      </div>
      <p className="graf-class-separator">{" - "}</p>
      <div className="graf-class-prop graf-class-desc">
        <p>{props.classDesc}</p>
      </div>
    </NotationWrapper>
  </CompactWrapper>
)

CompactClassField.propTypes = {
  className: PropTypes.string.isRequired,
  classSuperType: PropTypes.string.isRequired,
  classDesc: PropTypes.string.isRequired,
  handleExtend: PropTypes.func.isRequired,
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

    <CompactWrapper className="graf-class-compact">
      <i className="fas fa-caret-down icon-left" onClick={props.handleExtend} />
      <NotationWrapper>
        <div className="graf-class-name">
          <p>{props.className}</p>
        </div>
        <p className="graf-class-separator">{" < "}</p>
        <div className="graf-class-supertype">
          <p>{props.classSuperType}</p>
        </div>
      </NotationWrapper>
    </CompactWrapper>
    <div className={"graf-class-prop graf-class-name"}>
      <label htmlFor={`class-name-${props.index}`}>Class Name</label>
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
      <label htmlFor={`class-type-${props.index}`}>Class Supertype</label>
      <Select
        id={`class-type-${props.index}`}
        name={`class-type-${props.index}`}
        className="graf-type-select"
        isSearchable={true}
        isClearable={true}
        isDisabled={!props.isEditable}
        placeholder="Type"
        value={props.classSuperType}
        onChange={props.handleSuperTypeChange}
        options={ClassField.types}
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
    <div className={"graf-class-prop graf-class-desc"}>
      <label htmlFor={`class-desc-${props.index}`}>Class Description</label>
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

const PropertiesContainer = ({ index, props }) => (
  <div className="graf-class-prop graf-class-properties">
    <label htmlFor={`graf-class-props-container-${index}`}>Class Properties</label>
    <div id={`graf-class-props-container-${index}`} className="graf-class-props-container">
      {props}
    </div>
  </div>
)

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

  handleSuperTypeChange = ({ value }, { action }) => {
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
    const propsContainer = (
      <PropertiesContainer index={this.props.index} props={props} />
    )
    return (
      <Wrapper className="graf-class boxed">
        {this.state.isExtended ? (
          <ExtendedClassField
            index={this.props.index}
            handleNameChange={this.handleNameChange}
            handleSuperTypeChange={this.handleSuperTypeChange}
            handleDescChange={this.handleDescChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExtend={this.handleExtend}
            {...this.state}
          >
            {propsContainer}
          </ExtendedClassField>
        ) : (
          <CompactClassField handleExtend={this.handleExtend} {...this.state}>
            {propsContainer}
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
