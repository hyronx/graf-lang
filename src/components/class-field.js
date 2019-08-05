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
  static types = getTypes().map(t => ({ label: t, value: t }))

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
    this.setState(state => ({
      isEditable: !state.isEditable,
    }))
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
            this.props.onUpdate({ ...this.state, supertype: this.state.type })
        : undefined
    )
  }

  render() {
    return (
      <FieldWrapper
        className={`graf-class active ${this.props.isBoxed ? "boxed" : ""}`}
      >
        {this.props.isExpanded ? (
          <ExtendedField
            index={this.props.index}
            prefix={"class"}
            wrapper={ExtendedWrapper}
            title={props => (
              <CompactWrapper className="graf-class-compact">
                {/*<i className="fas fa-caret-down icon-left" onClick={props.handleExpand} />*/}
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
            index={this.props.index}
            prefix={"class"}
            wrapper={CompactWrapper}
            props={[
              { seperator: "class " },
              { name: "name", label: this.state.name },
            ].concat(
              this.state.type
                ? [
                    { seperator: " extends " },
                    { name: "supertype", label: this.state.type },
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
}

ClassField.defaultProps = {
  isEditable: false,
  isExpanded: false,
  isBoxed: false,
}

export default ClassField
