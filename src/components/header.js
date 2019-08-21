import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import Menu, { SubMenu, Item as MenuItem, Divider } from "rc-menu"
import GlobalMenuStyle from "./menu"
import theme from "../../config/theme"

const menuPrefixClass = "graf-header-menu"

const HeaderWrapper = styled.header`
  background: ${theme.colors.dark.default.background};
  margin-bottom: 1.45rem;
`

const MenuItemWrapper = styled.div`
  > i {
    margin-right: 10px;
  }

  display: inline-grid;
  grid: 2rem / auto auto;
  text-align: center;
`

const Header = ({ siteTitle }) => (
  <HeaderWrapper className="graf-header">
    <GlobalMenuStyle prefixClass={menuPrefixClass} />
    <Menu
      mode="horizontal"
      openAnimation="slide-up"
      prefixCls={menuPrefixClass}
    >
      <SubMenu title="Data" key="1">
        <MenuItem key="1-1">
          <MenuItemWrapper>
            <i className="fas fa-plus" />
            Class
          </MenuItemWrapper>
        </MenuItem>
        <MenuItem key="1-2">
          <MenuItemWrapper>
            <i className="fas fa-plus" />
            Operation
          </MenuItemWrapper>
        </MenuItem>
        <MenuItem key="1-3">
          <MenuItemWrapper>
            <i className="fas fa-plus" />
            Constant
          </MenuItemWrapper>
        </MenuItem>
      </SubMenu>
      <SubMenu title="Code" key="2">
        <MenuItem key="2-1">
          <MenuItemWrapper>
            <i className="fas fa-plus" />
            Node
          </MenuItemWrapper>
        </MenuItem>
      </SubMenu>
    </Menu>
  </HeaderWrapper>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
