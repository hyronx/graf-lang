import React, { Fragment, useState, useEffect } from "react"
import PropTypes from "prop-types"
import Select from "react-select"
import Modal from "react-modal"
import styled from "styled-components"
import Rete from "rete"
import { createNode } from "../utils"
import theme from "../../../../config/theme"
import selectStyles from "./select-styles"

Modal.setAppElement("#___gatsby")

const backgroundColor = theme.colors.dark.default.paper

const modalStyles = {
  overlay: {
    backgroundColor: theme.colors.dark.overlay.background,
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.colors.dark.default.paper,
    zIndex: 100,
  },
}

const ModalInnerWrapper = styled.div`
  ::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: black;
    outline: 1px solid black;
  }

  height: calc(${props => props.cssHeight} + 100px);
  width: ${props => props.cssWidth};
  padding: 1rem;
  overflow-y: auto;
`

export const MainMenu = ({
  show,
  onHide,
  height = "500px",
  width = "500px",
  editor,
  items,
  selectProps,
}) => {
  const [mouse, updateMouse] = useState({ x: 0, y: 0 })
  const [value, setValue] = useState(null)

  const handleChange = async (target, { action, removedValue }) => {
    const flattenedItems = items.flatMap(i => i.options)
    const targets = Array.isArray(target) ? target : [target]
    switch (action) {
      case "select-option":
      case "set-value":
        for (const target of targets) {
          const node = await createNode(
            flattenedItems.find(i => i.label === target.label).value,
            mouse
          )
          editor.addNode(node)
        }
        setValue(Array.isArray(target) ? targets : target)
        break
      case "remove-value":
        setValue(
          Array.isArray(value)
            ? value.filter(({ label }) => label !== removedValue.label)
            : null
        )
        break
      case "clear":
        setValue(null)
        break
      default:
        break
    }
  }

  useEffect(() => {
    editor.on("mousemove", ({ x, y }) => updateMouse({ x, y }))
  }, [])

  return (
    <Fragment>
      <Modal isOpen={show} onRequestClose={onHide} style={modalStyles}>
        <ModalInnerWrapper cssHeight={height} cssWidth={width}>
          <Select
            defaultMenuIsOpen={show}
            autoFocus={true} // eslint-disable-line
            isSearchable={true}
            isClearable={true}
            isDisabled={false}
            isMulti={true}
            maxMenuHeight={height}
            options={items}
            value={value}
            styles={selectStyles}
            menuPortalTarget={document.body}
            onChange={handleChange}
            {...selectProps}
          />
        </ModalInnerWrapper>
      </Modal>
    </Fragment>
  )
}

MainMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  editor: PropTypes.instanceOf(Rete.NodeEditor).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ),
  selectProps: PropTypes.object,
}

export default MainMenu
