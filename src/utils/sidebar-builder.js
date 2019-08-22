// @flow

import React from "react"
import uuid from "uuid/v4"
import { ClassType, OperationType } from "graf-core"
import ClassField from "../components/class-field"
import OperationField from "../components/operation-field"
import ParameterField from "../components/parameter-field"
import TestSetField from "../components/testset-field"
import AddButton from "../components/add-button"
import { addTypes, getSidebarData } from "../state"

interface TreeDataNode {
  title: any;
  props?: {
    isBoxed: boolean,
    isExpanded: boolean,
    uuid: string,
  };
  params?: any;
  testSets?: Array<{ inputs: [Argument, any][], output: any }>;
  uuid: string;
  type: string;
  expanded: boolean;
  editable: boolean;
  children: any[];
}

interface SidebarBuilderProps {
  onElementAdded: any => void;
}

export default class SidebarBuilder {
  #treeData: TreeDataNode[] = []

  constructor(props: SidebarBuilderProps) {
    this.props = props
  }

  get treeData() {
    this.#treeData = getSidebarData().map(this.createFieldForNode)
    return this.#treeData
  }

  prepareProps = node => ({
    ...node.props,
    isBoxed: true,
    uuid: uuid(),
  })

  findNode(key) {
    let target,
      children = this.#treeData
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

  prepareNodeForUpdate(typeState) {
    const updatedNode = this.findNode(typeState.uuid)
    if (updatedNode) updatedNode.editable = !updatedNode.editable

    return updatedNode.toType(typeState)
  }

  createFieldForNode = node => {
    const updatedProps = this.prepareProps(node)

    const onUpdate = typeState => {
      const newType = this.prepareNodeForUpdate(typeState)
      addTypes(newType)
      this.props.onElementAdded(newType)
    }

    const onEdit = typeState => {
      const updatedNode = this.findNode(typeState.uuid)
      if (updatedNode) updatedNode.editable = !updatedNode.editable

      const editedType = this.prepareNodeForUpdate(typeState)
      addTypes(editedType)
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
    toType(state = {}) {
      return new ClassType({
        ...this.props,
        ...state,
      })
    },
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
    toType(state = {}) {
      return new OperationType({
        ...this.props,
        ...state,
      })
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
}
