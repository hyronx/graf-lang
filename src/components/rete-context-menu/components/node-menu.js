import React, { Fragment, useState, useEffect } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Rete from "rete"
import Select from "react-select"
import theme from "../../../../config/theme"
import selectStyles from "./select-styles"

const backgroundColor = theme.colors.dark.default.paper

const StyledContainer = styled.div`
  display: ${props => (props.show ? "block" : "none")};
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  height: calc(${props => props.cssHeight} + 100px);
  width: ${props => props.cssWidth};
  background-color: ${backgroundColor};
`

export const NodeMenu = ({
  show,
  onHide,
  position,
  height = "300px",
  width = "200px",
  editor,
  items,
  selectProps,
}) => {
  const handleChange = async (target, { action }) => {
    if (action === "select-option") {
      target.value()
      onHide()
    }
  }

  return (
    <Fragment>
      <StyledContainer
        show={show}
        cssHeight={height}
        cssWidth={width}
        {...position}
      >
        <Select
          defaultMenuIsOpen={show}
          autoFocus={true} // eslint-disable-line
          isSearchable={true}
          isClearable={false}
          isDisabled={false}
          isMulti={false}
          maxMenuHeight={height}
          options={items}
          styles={selectStyles}
          menuPortalTarget={document.body}
          onChange={handleChange}
          {...selectProps}
        />
      </StyledContainer>
    </Fragment>
  )
}

NodeMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
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

export default NodeMenu
