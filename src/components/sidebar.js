import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Menu, { SubMenu, Item as MenuItem, Divider } from "rc-menu"
import { setSidebarData } from "../state"
import theme from "../../config/theme"

const menuPrefixClass = "graf-sidebar"

const Wrapper = styled.div`
  /*
  .rstcustom__rowContents {
    /*
    background-color: #21232b;
    border-radius: 0.8rem;
    border: 1px solid black;
    *
    z-index: 5;
    width: auto;
  }

  .rst__virtualScrollOverride::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  .rst__virtualScrollOverride::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  .rst__virtualScrollOverride::-webkit-scrollbar-thumb {
    background-color: black;
    outline: 1px solid black;
  }
  */

  .${props => props.prefixClass} {
    list-style: none;
  }

  .${props => props.prefixClass}-item-active,
    .${props => props.prefixClass}-submenu-active
    > .${props => props.prefixClass}-submenu-title {
    background-color: ${props => props.theme.default.active};
  }
  .${props => props.prefixClass}-item-selected {
    background-color: ${props => props.theme.default.active};
    transform: translateZ(0);
  }
  .${props => props.prefixClass}-submenu-selected {
    background-color: ${props => props.theme.default.active};
  }

  height: 100%;
`

Wrapper.propTypes = {
  prefixClass: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    default: {
      paper: PropTypes.string.isRequired,
      background: PropTypes.string.isRequired,
      hover: PropTypes.string.isRequired,
      active: PropTypes.string.isRequired,
    },
    text: {
      default: PropTypes.string.isRequired,
      primary: PropTypes.string.isRequired,
    },
    overlay: {
      background: PropTypes.string.isRequired,
    },
  }).isRequired,
}

Wrapper.defaultProps = {
  theme: theme.colors.dark,
}

export default class Sidebar extends React.Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    openKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    onAddElement: PropTypes.func,
    onElementAdded: PropTypes.func,
    onElementSelected: PropTypes.func,
  }

  static defaultProps = {
    onAddElement: type => {},
    onElementAdded: node => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      openKeys: this.props.openKeys || [],
      selectedKeys: this.props.selectedKeys || [],
    }
  }

  componentWillUnmount() {
    setSidebarData(this.props.treeData)
  }

  itemIcon = (
    <i className="fas fa-caret-right" onClick={this.props.handleExpand} />
  )

  expandIcon = (
    <i className="fas fa-caret-down" onClick={this.props.handleExpand} />
  )

  handleClick = ({ item, keyPath }) => {
    const path = keyPath.slice(0).reverse()
    let target,
      children = this.props.treeData
    for (const part of path) {
      target = children.find(child => child.uuid === part)
      if (target.children) {
        children = target.children
      }
    }

    switch (target.type) {
      case "AddButton":
        this.props.onAddElement(target.props.type, target)
        break
      default:
        target.expanded = !target.expanded
        this.setState(state => state)
        break
    }
  }

  isEditButtonTargeted() {
    const { className, localName } = event.target
    return className.includes("fa-edit") && localName === "i"
  }

  handleChange = currentOpenKeys => {
    let openKeys =
      currentOpenKeys.length > 0
        ? currentOpenKeys.slice(0)
        : this.state.openKeys.slice(0)
    const targets = this.props.treeData.filter(node =>
      openKeys.includes(node.uuid)
    )
    const targetsToClose = []
    let selectedKeys = []
    for (const target of targets) {
      if (target.expanded && this.isEditButtonTargeted()) {
        if (!openKeys.includes(target.uuid)) openKeys.push(target.uuid)
      } else if (target.expanded) {
        if (!openKeys.includes(target.uuid)) openKeys.push(target.uuid)
        if (!target.editable) {
          if (openKeys.includes(target.uuid)) targetsToClose.push(target.uuid)
          target.expanded = !target.expanded
        }

        selectedKeys = target.children.map(child => child.uuid)
      } else {
        if (this.state.openKeys.includes(target.uuid))
          targetsToClose.push(target.uuid)
        target.expanded = !target.expanded
      }
    }
    openKeys = openKeys.filter(key => !targetsToClose.includes(key))
    this.setState({ openKeys, selectedKeys })
  }

  handleSelect = ({ item, key }) => {
    if (this.props.onElementSelected) {
      this.props.onElementSelected(
        key,
        item.props.parentMenu.menuInstance.props.parentMenu.props.eventKey
      )
    }
    console.log("on select")
  }

  renderOperation(node) {
    if (this.state.openKeys.includes(node.uuid)) {
      return [
        ...node.paramFields.map(child => (
          <MenuItem key={child.uuid}>{child.title({ node })}</MenuItem>
        )),
        <Divider key={node.uuid + "-divider-0"} />,
        ...node.testSetFields.map(child => (
          <MenuItem key={child.uuid}>{child.title({ node })}</MenuItem>
        )),
      ]
    } else {
      return null
    }
  }

  renderClass(node) {
    if (this.state.openKeys.includes(node.uuid)) {
      return node.params.map(child => (
        <MenuItem key={child.uuid}>{child.title({ node })}</MenuItem>
      ))
    } else {
      return null
    }
  }

  render() {
    return (
      <Wrapper prefixClass={menuPrefixClass}>
        <Menu
          mode="inline"
          prefixCls={menuPrefixClass}
          selectedKeys={this.state.selectedKeys}
          onClick={this.handleClick}
          onOpenChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {this.props.treeData.map(node => {
            if (Array.isArray(node.children)) {
              let subMenuContent = null
              switch (node.type) {
                case "Operation":
                  subMenuContent = this.renderOperation(node)
                  break
                case "Class":
                default:
                  subMenuContent = this.renderClass(node)
                  break
              }
              return (
                <SubMenu title={node.title({ node })} key={node.uuid}>
                  {subMenuContent}
                </SubMenu>
              )
            } else {
              return <MenuItem key={node.uuid}>{node.title({ node })}</MenuItem>
            }
          })}
        </Menu>
      </Wrapper>
    )
  }
}
