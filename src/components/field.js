import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Select from "react-select"
import posed from "react-pose"
import { getTypes } from "graf-core"
import theme from "../../config/theme"

const backgroundColor = theme.colors.dark.default.paper

const selectStyles = {
  indicatorsContainer: styles => ({
    ...styles,
    height: "2rem",
    backgroundColor,
  }),
  control: styles => ({
    ...styles,
    height: "2rem",
    backgroundColor,
  }),
  valueContainer: styles => ({
    ...styles,
    height: "2rem",
    backgroundColor,
    color: "gold",
  }),
  menuList: styles => ({
    ...styles,
    backgroundColor,
  }),
  option: styles => ({
    ...styles,
    color: "white",
  }),
}

export const FieldWrapper = styled.div`
  i {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-content: center;
    align-content: center;
  }

  .icons {
    display: block;
    padding-bottom: 20px;
  }

  .right {
    float: right;
    margin-left: 10px;
  }

  h3,
  label,
  input,
  p,
  .graf-type-select {
    font-size: medium;
  }

  .graf-class-props-container {
    margin: 2rem 0;
  }

  /*
  border-radius: 0.8rem;
  border: 1px solid black;
  padding: 0.5em 0.5em 0.5em;
  */
  background-color: #21232b;
`

const IconContainer = posed.div({
  enter: {
    x: "0%",
    delayChildren: 200,
  },
  exit: {
    x: "-100%",
    delay: 300,
  },
})

export const ExtendedField = props => {
  const standardChildren = props.withoutStandardChildren
    ? []
    : [
        {
          name: "name",
          label: `${props.prefix.toUpperCase()} Name`,
          placeholder: "Name",
        },
        <div
          key={1}
          className={`graf-${props.prefix}-prop graf-${props.prefix}-supertype`}
        >
          <label htmlFor={`${props.prefix}-type-${props.index}`}>
            {props.prefix.toUpperCase()} {props.typeLabel}
          </label>
          <Select
            id={`${props.prefix}-type-${props.index}`}
            name={`${props.prefix}-type-${props.index}`}
            className="graf-type-select"
            isSearchable={true}
            isClearable={true}
            isDisabled={!props.isEditable}
            placeholder="Type"
            value={{ label: props.type, value: props.type }}
            onChange={(...args) => props.handleChange("type", ...args)}
            options={Object.entries(getTypes()).map(([key, value]) => ({
              label: key,
              value: key,
            }))}
            styles={selectStyles}
          />
        </div>,
        {
          name: "description",
          label: `${props.prefix.toUpperCase()} Description`,
          placeholder: "Description",
        },
      ]

  const children = standardChildren
    .concat(Array.isArray(props.children) ? props.children : [props.children])
    .map(child =>
      React.isValidElement(child) ? (
        child
      ) : (
        <div
          className={`graf-${props.prefix}-prop graf-${props.prefix}-${child.name}`}
        >
          <label htmlFor={`${props.prefix}-${child.name}-${props.index}`}>
            {child.label}
          </label>
          <input
            type={child.type || "text"}
            name={`${props.prefix}-desc-${props.index}`}
            id={`${props.prefix}-desc-${props.index}`}
            disabled={!props.isEditable}
            placeholder={child.placeholder}
            maxLength={30}
            value={props[child.name] || child.value}
            onChange={event => props.handleChange(child.name, event)}
          />
        </div>
      )
    )
  return (
    <props.wrapper
      className={`graf-${props.prefix}-extended`}
      onSubmit={props.handleSubmit}
    >
      {props.isEditable ? (
        <IconContainer className="icons">
          <span className="fas fa-times right" onClick={props.handleCancel} />
          <span className="fas fa-check right" onClick={props.handleSubmit} />
        </IconContainer>
      ) : (
        <IconContainer className="icons">
          <i className="fas fa-trash-alt right" />
          <i className="fas fa-edit right" onClick={props.handleEdit} />
        </IconContainer>
      )}

      {props.title.constructor.name === "Function"
        ? props.title(props)
        : props.title}
      {children}
    </props.wrapper>
  )
}

ExtendedField.propTypes = {
  index: PropTypes.number.isRequired,
  wrapper: PropTypes.object.isRequired,
  prefix: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  typeLabel: PropTypes.string,
  description: PropTypes.string,
  isEditable: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  withoutStandardChildren: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleExpand: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        type: PropTypes.string,
      }),
      PropTypes.element,
    ])
  ),
}

ExtendedField.defaultProps = {
  typeLabel: "Type",
  children: [],
  withoutStandardChildren: false,
}

export const NotationWrapper = styled.div`
  display: inline-grid;
  grid: 2rem / auto auto auto auto auto auto;
  text-align: center;
`

export const CompactField = props => (
  <props.wrapper className={`graf-class-compact`} {...props}>
    {props.props.map(p =>
      p.seperator ? (
        <p className={`graf-${props.prefix}-separator`}>{p.seperator}</p>
      ) : (
        <div
          className={`graf-${props.prefix}-prop graf-${props.prefix}-${p.name}`}
        >
          <p>{p.label}</p>
        </div>
      )
    )}
  </props.wrapper>
)

CompactField.propTypes = {
  index: PropTypes.number.isRequired,
  wrapper: PropTypes.object.isRequired,
  prefix: PropTypes.string.isRequired,
  props: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        seperator: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  //handleExpand: PropTypes.func.isRequired,
}
