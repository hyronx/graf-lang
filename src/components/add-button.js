import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const AddButtonWrapper = styled.div`
  > span {
    margin-right: 0.75rem;
  }

  position: relative;
  text-align: center;
`

const AddButton = ({ onClick, label, className }) => (
  <AddButtonWrapper className={className} onClick={onClick}>
    <span className="fas fa-plus" />
    {label}
  </AddButtonWrapper>
)

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.oneOf([PropTypes.string, PropTypes.element]).isRequired,
  className: PropTypes.string,
}

AddButton.defaultProps = {
  className: "graf-add-button",
}

export default AddButton
