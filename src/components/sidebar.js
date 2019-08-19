import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import SortableTree, { getNodeAtPath } from "react-sortable-tree"
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer"
import "react-sortable-tree/style.css"
import uuid from "uuid/v4"
//import { Type } from "graf-core"
import ClassField from "./class-field"
import OperationField from "./operation-field"
import ParameterField from "./parameter-field"
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

  height: 100%;
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
      case "Operation":
        return this.createOpField(node.props, node.params)
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

  createOpField = (props, params) => ({
    title: this.createTitle(OperationField, props),
    props: Object.assign(props, {
      onUpdate(opType) {
        addTypes(opType)
      },
    }),
    params,
    uuid: uuid(),
    type: "Operation",
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
      <AddButton
        className="box"
        label={node.props.type}
        onClick={() => {
          const parent = getNodeAtPath({
            treeData: this.state.treeData,
            path: path.slice(0, path.length - 1),
            getNodeKey: this.getNodeKey,
          })
          this.props.onAddElement(node.props.type, parent.node)
        }}
      />
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
    const result = node.expanded ? 500 : 100
    return result
  }

  canDragNode = ({ node }) =>
    !node.isExpanded &&
    node.type !== "AddButton" &&
    node.expanded !== undefined &&
    !node.expanded

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
          theme={FileExplorerTheme}
          innerStyle={{
            paddingLeft: "10px",
          }}
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
