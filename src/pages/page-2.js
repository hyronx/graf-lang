import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Modal from "react-modal"
import Rete from "rete"
import ConnectionPlugin from "rete-connection-plugin"
import ReactRenderPlugin from "rete-react-render-plugin"
import ModulePlugin from "rete-module-plugin"
import ContextMenuPlugin from "../components/rete-context-menu"
import { ClassType, OperationType } from "graf-core"
import ClassField from "../components/class-field"
import ParameterField from "../components/parameter-field"
import OperationField from "../components/operation-field"
import TestSetField from "../components/testset-field"
import { getTypes, addTypes } from "../state"
import {
  NumberComponent,
  TextComponent,
  VariableComponent,
  LambdaComponent,
  ArrayComponent,
  ReferenceComponent,
  FunctionComponent,
  FunctionInputComponent,
  FunctionOutputComponent,
  AddComponent,
  SubtractComponent,
  MultiplyComponent,
  DivideComponent,
  PowerComponent,
  ModuloComponent,
  JoinComponent,
  CallComponent,
  LogComponent,
  MapComponent,
  CaseComponent,
  MatchComponent,
} from "../components/rete"
import Layout from "../components/layout"
import SEO from "../components/seo"
import theme from "../../config/theme"
import { buildEditorView } from "../utils/editor-utils"

const components = [
  new NumberComponent(),
  new TextComponent(),
  new VariableComponent(),
  new LambdaComponent(),
  new ArrayComponent(),
  new ReferenceComponent(),
  new FunctionComponent(),
  new FunctionInputComponent(),
  new FunctionOutputComponent(),
  new AddComponent(),
  new SubtractComponent(),
  new MultiplyComponent(),
  new DivideComponent(),
  new PowerComponent(),
  new ModuloComponent(),
  new JoinComponent(),
  new CallComponent(),
  new LogComponent(),
  new MapComponent(),
  new CaseComponent(),
  new MatchComponent(),
]

const ReteWrapper = styled.div`
  #rete input {
    background-color: ${theme.colors.dark.default.paper};
  }

  width: 100%;
  height: 600px;
  background-color: ${theme.colors.dark.board.background};
`

const modalStyles = {
  overlay: {
    backgroundColor: theme.colors.dark.overlay.background,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.colors.dark.default.paper,
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

  width: 500px;
  height: 500px;
  padding: 1rem;
  overflow-y: auto;
`

Modal.setAppElement("#___gatsby")

const reteGrafId = "graf@0.1.0"

const SecondPage = props => {
  const [openModal, setOpenModal] = useState(null)
  let editor = null

  useEffect(() => {
    async function init() {
      const container = document.querySelector("#rete")
      editor = new Rete.NodeEditor(reteGrafId, container)
      const engine = new Rete.Engine(reteGrafId)

      editor.use(ConnectionPlugin)
      editor.use(ReactRenderPlugin)
      editor.use(ContextMenuPlugin)
      editor.use(ModulePlugin, { engine, modules: {} })

      for (const comp of components) {
        editor.register(comp)
        engine.register(comp)
      }
      //const n1 = await numComponent.createNode({ first: 1 })
      //n1.position = [80, 200]
      //editor.addNode(n1)

      editor.on(
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
          await engine.abort()
          await engine.process(editor.toJSON())
        }
      )

      editor.view.resize()
      editor.trigger("process")
    }
    init()
  }, [])

  const handleCloseModal = () => setOpenModal(null)

  const getModalContent = () => {
    let modalContent = null
    switch (openModal) {
      case "Class":
        modalContent = (
          <ClassField
            index={0}
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            onUpdate={handleAddClassType}
          />
        )
        break
      case "Parameter":
        modalContent = (
          <ParameterField
            index={0}
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            onUpdate={handleAddParam}
          />
        )
        break
      case "TestSet":
        modalContent = (
          <TestSetField
            index={0}
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            onUpdate={handleAddTestSet}
          />
        )
        break
      case "Operation":
        modalContent = (
          <OperationField
            index={0}
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            showParams={true}
            onUpdate={handleAddOpType}
          />
        )
        break
      default:
        break
    }
    return modalContent
  }

  const handleAddParam = param => {
    const parentType = getTypes().find(
      typeName => typeName === this.state.parentNode.props.name
    )
    parentType.properties = [...parentType.properties.concat, param]
    addTypes(parentType)
    handleElementAdded()
  }

  const handleAddTestSet = testSet => {
    const parentType = getTypes().find(
      typeName => typeName === this.state.parentNode.props.name
    )
    parentType.testSets = [...parentType.testSets.concat, testSet]
    addTypes(parentType)
    handleElementAdded()
  }

  const handleAddClassType = typeState => {
    addTypes(new ClassType(typeState))
    handleElementAdded()
  }

  const handleAddOpType = typeState => {
    addTypes(new OperationType(typeState))
    handleElementAdded()
  }

  const handleAddElement = (type, parentNode) => setOpenModal(type)

  const handleElementAdded = () => setOpenModal(null)

  const updateType = node => {
    switch (node.typeName) {
      case "Operation":
        addTypes(new OperationType(node))
        break
      case "Class":
        addTypes(new ClassType(node))
        break
      default:
        break
    }
  }

  const handleSelect = async path => {
    const node = path[path.length - 1]
    if (node.data.typeName !== "Operation")
      throw new Error("Selected node is not a Operation:", node)

    if (editor) {
      if (node.data.code.id === reteGrafId)
        await editor.fromJSON(node.data.code)
      else await buildEditorView(node.data, editor)
    }
  }

  const handleDeselect = async path => {
    const node = path[path.length - 1]
    if (node.data.typeName !== "Operation")
      throw new Error("Selected node is not a Operation:", node)

    node.data.code = await editor.toJSON()
    updateType(node.data)
  }

  return (
    <Layout
      outerContainerId={"outer-container"}
      pageWrapId={"page-wrap"}
      treeData={getTypes()}
      modals={[
        <Modal
          key={`modal-0`}
          isOpen={openModal !== null}
          onRequestClose={handleCloseModal}
          style={modalStyles}
        >
          <ModalInnerWrapper>{getModalContent()}</ModalInnerWrapper>
        </Modal>,
      ]}
      onAddElement={handleAddElement}
      onElementAdded={handleElementAdded}
      onElementSelected={handleSelect}
      onElementDeselected={handleDeselect}
    >
      <SEO title="Page two" />
      <ReteWrapper>
        <div id="rete"></div>
      </ReteWrapper>
      <Link to="/page-3/">Go to tree page</Link>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default SecondPage
