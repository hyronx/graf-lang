import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { FaCaretUp } from "react-icons/fa"
import theme from "../../config/theme"

const ContextMenuWrapper = styled.div`
  z-index: 100;
`

const InnerCircle = styled.circle`
  background-color: ${theme.colors.dark.default.background};
  margin: 20px;
`

const ContextMenu = ({ innerCircle, show = false, onShow, onHide }) => {
  return (
    show && (
      <ContextMenuWrapper>
        <svg width={500} height={500}>
          <InnerCircle
            onContextMenu={onShow}
            onClick={onHide}
            {...innerCircle}
          />
          <FaCaretUp x={innerCircle.cx} y={innerCircle.cy} />
        </svg>
      </ContextMenuWrapper>
    )
  )
}

ContextMenu.propTypes = {
  innerCircle: PropTypes.shape({
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
  }).isRequired,
  show: PropTypes.bool,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
}

export default ContextMenu
