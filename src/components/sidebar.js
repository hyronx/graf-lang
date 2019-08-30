import React, { useState } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { FaCaretRight, FaCaretDown } from "react-icons/fa"
import posed from "react-pose"
import { Node } from "graf-core"
import OperationField from "./operation-field"
import ClassField from "./class-field"
import ParameterField from "./parameter-field"
import theme from "../../config/theme"

const createField = (component, props) => {
  return React.createElement(component, props)
}

const SidebarElementWrapper = styled.li`
  .graf-sidebar-element-container {
    display: inline-grid;
    grid: auto / auto auto;
  }

  .graf-sidebar-element-caret {
    position: relative;
    top: 40%;
    left: 50%;
  }

  .graf-sidebar-element-content {
    position: relative;
    top: 10%;
    left: 10%;
  }

  height: 100%;
`

const SidebarElementContainer = posed.div({
  hoverable: props => props.hoverable,
  pressable: props => props.pressable,
  init: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
  },
  press: {
    scale: 1.05,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
  props: {
    hoverable: true,
    pressable: true,
  },
})

const SidebarElement = ({
  element,
  isSelected,
  onClick,
  onSelect,
  onDeselect,
  className = "graf-sidebar-element",
  children,
}) => (
  <SidebarElementWrapper
    onClick={event => {
      if (onSelect && !isSelected) onSelect({ event, element })
      if (onDeselect && isSelected) onDeselect({ event, element })
      if (onClick) onClick({ event, element })
    }}
    className={className + (isSelected ? ` ${className}-selected` : "")}
  >
    <SidebarElementContainer
      className="graf-sidebar-element-container"
      hoverable={!isSelected}
    >
      {isSelected ? (
        <FaCaretDown className="graf-sidebar-element-caret" />
      ) : (
        <FaCaretRight className="graf-sidebar-element-caret" />
      )}
      <div className="graf-sidebar-element-content">
        {createField(
          (function(elementType) {
            switch (elementType) {
              case "Operation":
                return OperationField
              case "Class":
                return ClassField
              case "Parameter":
                return ParameterField
              default:
                throw new Error(`Unknown element type: ${elementType}`)
            }
          })(element.typeName),
          { ...element, isExpanded: isSelected }
        )}
        {children}
      </div>
    </SidebarElementContainer>
  </SidebarElementWrapper>
)

SidebarElement.propTypes = {
  element: PropTypes.instanceOf(Node),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  className: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
}

const SidebarWrapper = styled.div`
  .graf-sidebar-list {
    list-style: none;
  }

  .graf-sidebar-element-selected {
    background-color: ${theme.colors.dark.default.paper};
    transform: translateZ(0);
  }
`

const SidebarList = posed.ul()

const Sidebar = ({
  elements,
  selectable,
  selectedElements = [],
  onClick,
  onSelect,
  onDeselect,
}) => {
  const [selected, setSelected] = useState(selectedElements)

  return (
    <SidebarWrapper>
      <SidebarList pose="open" className="graf-sidebar-list">
        {elements.map(element => (
          <SidebarElement
            key={element.uuid}
            isSelected={selected.includes(element)}
            element={element}
            onClick={onClick}
            onSelect={
              selectable
                ? data => {
                    setSelected([...selected, element])
                    if (onSelect) onSelect(data)
                  }
                : undefined
            }
            onDeselect={
              selectable
                ? data => {
                    setSelected(selected.filter(e => e !== element))
                    if (onDeselect) onDeselect(data)
                  }
                : undefined
            }
          >
            {selected.find(s => element.equals(s)) &&
              element.args.map(arg => (
                <SidebarElement
                  key={arg.uuid}
                  element={arg}
                  onClick={onClick}
                />
              ))}
          </SidebarElement>
        ))}
      </SidebarList>
    </SidebarWrapper>
  )
}

Sidebar.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.instanceOf(Node)).isRequired,
  selectable: PropTypes.bool,
  selectedElements: PropTypes.arrayOf(PropTypes.instanceOf(Node)),
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
}

export default Sidebar
