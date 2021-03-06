import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { getTypes } from "graf-core"
import {
  FieldWrapper,
  NotationWrapper,
  CompactField,
  ExtendedField,
} from "./field"
import theme from "../../config/theme"

const backgroundColor = theme.colors.dark.default.paper

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
    z-index: 5;
  }

  .graf-class-separator {
    margin: 0 5px;
  }
`

class ClassField extends React.Component {
  static types = Object.entries(getTypes()).map(([name, def]) => ({
    label: name,
    value: def,
  }))

  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name || "",
      description: this.props.description || "",
      type: this.props.supertype || "",
      generics: this.props.generics || [],
      interfaces: this.props.interfaces || [],
      mixins: this.props.mixins || [],
      properties: this.props.properties || [],
      methods: this.props.methods || [],

      isEditable: this.props.isEditable,
      isExpanded: this.props.isExpanded,
    }
  }

  handleChange = (source, event, data) => {
    switch (source) {
      case "type":
        this.handleSuperTypeChange(event, data)
        break
      default:
        this.setState({ [source]: event.target.value })
        break
    }
  }

  handleSuperTypeChange = ({ value }, { action }) => {
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
                supertype: this.state.type,
              },
              this.state
            )
        : undefined
    )
  }

  handleCancel = () => {}

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
                supertype: this.state.type,
              },
              this.state
            )
        : undefined
    )
  }

  render() {
    const { index, isBoxed, isExpanded } = this.props
    const { name, type } = this.state
    return (
      <FieldWrapper className={`graf-class active ${isBoxed ? "box" : ""}`}>
        {isExpanded ? (
          <ExtendedField
            index={index}
            prefix={"class"}
            wrapper={ExtendedWrapper}
            title={props => (
              <CompactWrapper className="graf-class-compact">
                <NotationWrapper>
                  <p className="graf-class-separator">class</p>
                  <div className="graf-class-name">
                    <p>{props.name}</p>
                  </div>
                  {props.type ? (
                    <>
                      <p className="graf-class-separator">{"<"}</p>
                      <div className="graf-class-supertype">
                        <p>{props.type}</p>
                      </div>
                    </>
                  ) : null}
                </NotationWrapper>
              </CompactWrapper>
            )}
            typeLabel={"Supertype"}
            handleChange={this.handleChange}
            handleCancel={this.handleCancel}
            handleEdit={this.handleEdit}
            handleSubmit={this.handleSubmit}
            handleExpand={this.handleExpand}
            {...this.state}
          />
        ) : (
          <CompactField
            index={index}
            prefix={"class"}
            wrapper={CompactWrapper}
            props={[
              { seperator: "class " },
              { name: "name", label: name },
            ].concat(
              type
                ? [
                    { seperator: " extends " },
                    { name: "supertype", label: type },
                  ]
                : []
            )}
          />
        )}
      </FieldWrapper>
    )
  }
}

ClassField.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  supertype: PropTypes.string,
  description: PropTypes.string,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isBoxed: PropTypes.bool,
  onExpand: PropTypes.func,
  onUpdate: PropTypes.func,
  onEdit: PropTypes.func,
}

ClassField.defaultProps = {
  isEditable: false,
  isExpanded: false,
  isBoxed: true,
}

export default ClassField
