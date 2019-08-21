import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
//import SortableTree, { getNodeAtPath } from "react-sortable-tree"
//import FileExplorerTheme from "react-sortable-tree-theme-file-explorer"
//import "react-sortable-tree/style.css"
import Menu, { SubMenu, Item as MenuItem, Divider } from "rc-menu"
import uuid from "uuid/v4"
//import { Type } from "graf-core"
import ClassField from "./class-field"
import OperationField from "./operation-field"
import ParameterField from "./parameter-field"
import TestSetField from "./testset-field"
import AddButton from "./add-button"
import { getSidebarData, setSidebarData, addTypes } from "../state"

const Wrapper = styled.div`
  .rstcustom__rowContents {
    /*
    background-color: #21232b;
    border-radius: 0.8rem;
    border: 1px solid black;
    */
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

  .rc-menu {
    list-style: none;
  }

  height: 100%;
`

class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: getSidebarData().map(this.createFieldForNode),
      openKeys: [],
    }
  }

  prepareProps = node => ({
    ...node.props,
    isBoxed: true,
    uuid: uuid(),
  })

  createFieldForNode = node => {
    const updatedProps = this.prepareProps(node)

    const onUpdate = typeState => {
      addTypes(typeState)
      this.props.onElementAdded(typeState)

      const node = this.findNode(typeState.uuid)
      if (node) node.editable = !node.editable
    }

    const onEdit = typeState => {
      const node = this.findNode(typeState.uuid)
      if (node) node.editable = !node.editable
    }

    switch (node.type) {
      case "Class":
        return this.createClassField(
          { ...updatedProps, onUpdate, onEdit },
          node.params
        )
      case "Operation":
        return this.createOpField(
          { ...updatedProps, onUpdate, onEdit, showParams: false },
          node.params,
          node.testSets
        )
      case "Parameter":
        return this.createParamField(updatedProps, node.params)
      case "TestSet":
        return this.createTestSetField(updatedProps, node.params)
      case "AddButton":
        return this.createAddButton(node.props)
      default:
        throw new Error("Unknown or undefined node type")
    }
  }

  createTitle = (component, props) => data => {
    const adjustedProps = {}
    for (const key in props) {
      adjustedProps[key] =
        props[key] &&
        props[key].constructor.name === "Function" &&
        this.shouldCallProp(key)
          ? props[key](data)
          : props[key]
    }

    return React.createElement(component, adjustedProps)
  }

  shouldCallProp(propName) {
    return !propName.startsWith("on")
  }

  createClassField = (props, params) => ({
    title: this.createTitle(ClassField, props),
    props,
    params,
    get uuid() {
      // eslint-disable-next-line
      return this.props.uuid
    },
    type: "Class",
    get expanded() {
      // eslint-disable-next-line
      return this.props.isExpanded
    },
    set expanded(value) {
      // eslint-disable-next-line
      this.props.isExpanded = value
    },
    editable: props.isEditable || false,
    children: params
      .map(node => this.createParamField(this.prepareProps(node)))
      .concat([this.createAddButton({ type: "Parameter" })]),
  })

  createOpField = (props, params, testSets) => ({
    title: this.createTitle(OperationField, props),
    props,
    params,
    testSets,
    get uuid() {
      // eslint-disable-next-line
      return this.props.uuid
    },
    type: "Operation",
    get expanded() {
      // eslint-disable-next-line
      return this.props.isExpanded
    },
    set expanded(value) {
      // eslint-disable-next-line
      this.props.isExpanded = value
    },
    editable: props.isEditable || false,
    paramFields: params
      .map(node => this.createParamField(this.prepareProps(node)))
      .concat([this.createAddButton({ type: "Parameter" })]),
    testSetFields: testSets
      .map(node => this.createTestSetField(this.prepareProps(node)))
      .concat([this.createAddButton({ type: "TestSet" })]),
    get children() {
      return this.paramFields.concat(this.testSetFields)
    },
  })

  createParamField = props => ({
    title: this.createTitle(ParameterField, props),
    props,
    get uuid() {
      // eslint-disable-next-line
      return this.props.uuid
    },
    type: "Parameter",
    get expanded() {
      // eslint-disable-next-line
      return this.props.isExpanded
    },
    set expanded(value) {
      // eslint-disable-next-line
      this.props.isExpanded = value
    },
    editable: props.isEditable || false,
    children: [{}],
  })

  createTestSetField = props => ({
    title: this.createTitle(TestSetField, props),
    props,
    get uuid() {
      // eslint-disable-next-line
      return this.props.uuid
    },
    type: "TestSet",
    get expanded() {
      // eslint-disable-next-line
      return this.props.isExpanded
    },
    set expanded(value) {
      // eslint-disable-next-line
      this.props.isExpanded = value
    },
    editable: props.isEditable || false,
    children: [{}],
  })

  createAddButton = props => ({
    title: ({ node }) => (
      <AddButton className="box" label={node.props.type} onClick={() => {}} />
    ),
    props,
    expanded: false,
    type: "AddButton",
    uuid: uuid(),
  })

  componentWillUnmount() {
    setSidebarData(this.state.treeData)
  }

  itemIcon = (
    <i className="fas fa-caret-right" onClick={this.props.handleExpand} />
  )

  expandIcon = (
    <i className="fas fa-caret-down" onClick={this.props.handleExpand} />
  )

  findNode(key) {
    let target,
      children = this.state.treeData
    while (children !== undefined) {
      target = children.find(child => child.uuid === key)
      if (target) {
        return target
      } else {
        children = children.flatMap(child => child.children)
      }
    }
    return
  }

  handleClick = ({ item, keyPath }) => {
    const path = keyPath.slice(0).reverse()
    let target,
      children = this.state.treeData
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
    const targets = this.state.treeData.filter(node =>
      openKeys.includes(node.uuid)
    )
    const targetsToClose = []
    for (const target of targets) {
      if (target.expanded && this.isEditButtonTargeted()) {
        if (!openKeys.includes(target.uuid)) openKeys.push(target.uuid)
      } else if (target.expanded) {
        if (!openKeys.includes(target.uuid)) openKeys.push(target.uuid)
        if (!target.editable) {
          if (openKeys.includes(target.uuid)) targetsToClose.push(target.uuid)
          target.expanded = !target.expanded
        }
      } else {
        if (this.state.openKeys.includes(target.uuid))
          targetsToClose.push(target.uuid)
        target.expanded = !target.expanded
      }
    }
    openKeys = openKeys.filter(key => !targetsToClose.includes(key))
    this.setState({ openKeys })
  }

  handleSelect = ({ item, keyPath }) => {
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
      <Wrapper>
        <Menu
          mode="inline"
          //prefixCls="graf-side-menu"
          onClick={this.handleClick}
          onOpenChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {this.state.treeData.map(node => {
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

Sidebar.propTypes = {
  onAddElement: PropTypes.func,
  onElementAdded: PropTypes.func,
}

Sidebar.defaultProps = {
  onAddElement: type => {},
  onElementAdded: node => {},
}

export default Sidebar
