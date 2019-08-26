import React, { useState } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { FaCaretRight, FaCaretDown } from "react-icons/fa"
import { Node } from "graf-core"
import OperationField from "./operation-field"
import ClassField from "./class-field"

const createField = (component, props) => {
  return React.createElement(component, props)
}

const SidebarElementWrapper = styled.li`
  .graf-sidebar-element-container {
    display: inline-grid;
    grid: auto / auto auto;
  }

  .graf-sidebar-element-caret {
    display: block;
    margin: auto;
  }
`

const SidebarElement = ({
  element,
  isSelected,
  onClick,
  onSelect,
  onDeselect,
}) => (
  <SidebarElementWrapper
    onClick={event => {
      if (onSelect && !isSelected) onSelect({ event, element })
      if (onDeselect && isSelected) onDeselect({ event, element })
      if (onClick) onClick({ event, element })
    }}
  >
    <div className="graf-sidebar-element-container">
      <FaCaretRight className="graf-sidebar-element-caret" />
      {createField(
        (function(elementType) {
          switch (elementType) {
            case "Operation":
              return OperationField
            case "Class":
              return ClassField
            default:
              throw new Error(`Unknown element type: ${elementType}`)
          }
        })(element.typeName),
        element
      )}
    </div>
  </SidebarElementWrapper>
)

SidebarElement.propTypes = {
  element: PropTypes.instanceOf(Node),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
}

const SidebarWrapper = styled.div``

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
      <ul>
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
          />
        ))}
      </ul>
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
