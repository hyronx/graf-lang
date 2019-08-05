import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import SortableTree, { getNodeAtPath } from "react-sortable-tree"
import "react-sortable-tree/style.css"
import uuid from "uuid/v4"
//import { Type } from "graf-core"
import ClassField from "./class-field"
import ParameterField from "./parameter-field"
import { getSidebarData, setSidebarData, addTypes } from "../state"

const Wrapper = styled.div`
  .rst__rowContents {
    background-color: #21232b;
    border-radius: 0.8rem;
    border: 1px solid black;
    z-index: 2;
  }

  height: 100%;
`

const AddButtonWrapper = styled.div`
  > i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0%, -50%);
  }

  > label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(75%, -50%);
  }

  position: relative;
`

class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: getSidebarData().map(this.createFieldForNode),
    }
  }

  createFieldForNode = node => {
    switch (node.type) {
      case "Class":
        return this.createClassField(node.props, node.params)
      case "Parameter":
        return this.createParamField(node.props, node.params)
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
        props[key].constructor.name === "Function" && this.shouldCallProp(key)
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
    props: Object.assign(props, {
      onUpdate(classType) {
        addTypes(classType)
      },
    }),
    params,
    uuid: uuid(),
    type: "Class",
    get expanded() {
      // eslint-disable-next-line
      return this.props.isExpanded
    },
    set expanded(value) {
      // eslint-disable-next-line
      this.props.isExpanded = value
    },
    children: params
      .map(({ props }) => this.createParamField(props))
      .concat([this.createAddButton({ type: "Parameter" })]),
  })

  createParamField = props => ({
    title: this.createTitle(ParameterField, props),
    props,
    uuid: uuid(),
    type: "Parameter",
    get expanded() {
      // eslint-disable-next-line
      return this.props.isExpanded
    },
    set expanded(value) {
      // eslint-disable-next-line
      this.props.isExpanded = value
    },
    children: [{}],
  })

  createAddButton = props => ({
    title: ({ node, path }) => (
      <AddButtonWrapper
        onClick={() => {
          const parent = getNodeAtPath({
            treeData: this.state.treeData,
            path: path.slice(0, path.length - 1),
            getNodeKey: this.getNodeKey,
          })
          this.props.onAddElement(node.props.type, parent.node)
        }}
      >
        <i className="fas fa-plus" />
        <label>{node.props.type}</label>
      </AddButtonWrapper>
    ),
    props,
    expanded: false,
    type: "AddButton",
    uuid: uuid(),
  })

  handleChange = treeData => {
    setSidebarData(treeData)
    this.setState({ treeData })
  }

  getNodeKey = ({ node }) => node.uuid

  generateNodeProps = ({ node }) => ({})

  handleNodeVisibilityToggle = ({ node, expanded }) => {
    Object.defineProperty(node, "expanded", {
      get: function() {
        // eslint-disable-next-line
        return this.props.isExpanded
      },
      set: function(value) {
        // eslint-disable-next-line
        this.props.isExpanded = value
      },
    })
    node.expanded = expanded
    Object.assign(node, this.createFieldForNode(node))
    this.forceUpdate()
  }

  getRowHeight = ({ node }) => {
    const result = node.expanded ? 400 : 62
    return result
  }

  canDragNode = ({ node }) =>
    node.type !== "AddButton" && node.expanded !== undefined && !node.expanded

  componentWillUnmount() {
    setSidebarData(this.state.treeData)
  }

  render() {
    return (
      <Wrapper>
        <SortableTree
          treeData={this.state.treeData}
          onChange={this.handleChange}
          getNodeKey={this.getNodeKey}
          generateNodeProps={this.generateNodeProps}
          onVisibilityToggle={this.handleNodeVisibilityToggle}
          rowHeight={this.getRowHeight}
          canDrag={this.canDragNode}
        />
      </Wrapper>
    )
  }
}

Sidebar.propTypes = {
  onAddElement: PropTypes.func,
}

Sidebar.defaultProps = {
  onAddElement: type => {},
}

export default Sidebar
