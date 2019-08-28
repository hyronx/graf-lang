import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"
import Modal from "react-modal"
import { max } from "d3-array"
import { Row, Col } from "react-flexbox-grid"
import { ClassType, OperationType } from "graf-core"
import Layout from "../components/layout"
import ClassField from "../components/class-field"
import ParameterField from "../components/parameter-field"
import OperationField from "../components/operation-field"
import TestSetField from "../components/testset-field"
import SEO from "../components/seo"
import CoffeeScript from "coffeescript"
//import Graph from "../components/graf"
import CodeInput from "../components/code-input"
import { executeNodesAsync, ASTProcessor, RootNode, LinkType } from "graf-core"
import theme from "../../config/theme"
import { getTypes, addTypes } from "../state"
import SidebarBuilder from "../utils/sidebar-builder"

const EditorWrapper = styled.div`
  .terminal-base {
    min-height: 200px;
    max-height: 200px;
  }

  height: 200px;
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

class ThirdPage extends React.Component {
  constructor(props) {
    super(props)

    this.reset = this.reset.bind(this)

    this.graph = React.createRef()
    this.astProcessor = new ASTProcessor()
    this.outerContainerId = "outer-container"
    this.pageWrapId = "page-wrap"
    this.sidebarBuilder = new SidebarBuilder({
      onElementAdded: this.handleElementAdded,
    })

    this.state = {
      nodes: [],
      links: [],
      height: this.props.height,
      width: this.props.width,
      openModal: null,
      treeData: this.sidebarBuilder.treeData,
      selectedElement: null,
      prevNodes: null,
      prevLinks: null,
    }
  }

  async addNodes(newNodes) {
    const firstNode = this.astProcessor.process(newNodes)
    const rootLink = RootNode.linkWith(
      firstNode,
      LinkType.BOTTOM_TO_DEEPER_RIGHT
    )
    const sortedNodes = this.astProcessor.nodes
      .filter(n => n.isRunnable)
      .sort((a, b) => a.execStep - b.execStep)
    console.log("Nodes sorted:", sortedNodes)

    await executeNodesAsync(sortedNodes[0], {
      onTry({ node }) {},
      onWillRun({ node, args }) {
        console.log(`Node ${node} called with:`, args)
      },
      onHasRun({ node, result, resultStack }) {
        console.log(`Node ${node} returning:`, result)
        console.log("Result stack:", resultStack)
      },
    })

    return new Promise(resolve =>
      this.setState(
        {
          height: max(
            this.astProcessor.nodes.map(n => n.y).concat([this.props.height])
          ),
          width: max(
            this.astProcessor.nodes.map(n => n.x).concat([this.props.width])
          ),
          nodes: [RootNode, ...this.astProcessor.nodes],
          links: [rootLink, ...this.astProcessor.links],
        },
        resolve
      )
    )
  }

  reset() {
    this.astProcessor.reset()
    return this.setState({
      nodes: [],
      links: [],
      height: this.props.height,
      width: this.props.width,
    })
  }

  handleCloseModal = () => this.setState({ openModal: null })

  getModalContent = () => {
    let modalContent = null
    switch (this.state.openModal) {
      case "Class":
        modalContent = (
          <ClassField
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            onUpdate={this.handleAddClassType}
          />
        )
        break
      case "Parameter":
        modalContent = (
          <ParameterField
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            onUpdate={this.handleAddParam}
          />
        )
        break
      case "TestSet":
        modalContent = (
          <TestSetField
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            onUpdate={this.handleAddTestSet}
          />
        )
        break
      case "Operation":
        modalContent = (
          <OperationField
            isExpanded={true}
            isEditable={true}
            isBoxed={false}
            showParams={true}
            onUpdate={this.handleAddOpType}
          />
        )
        break
      default:
        break
    }
    return modalContent
  }

  handleAddParam = param => {
    const parentType = getTypes().find(
      t => t.name === this.state.parentNode.props.name
    )
    parentType.properties = [...parentType.properties.concat, param]
    addTypes(parentType)
    this.handleElementAdded()
  }

  handleAddTestSet = testSet => {
    const parentType = getTypes().find(
      t => t.name === this.state.parentNode.props.name
    )
    parentType.testSets = [...parentType.testSets.concat, testSet]
    addTypes(parentType)
    this.handleElementAdded()
  }

  handleAddClassType = typeState => {
    addTypes(new ClassType(typeState))
    this.handleElementAdded()
  }

  handleAddOpType = typeState => {
    addTypes(new OperationType(typeState))
    this.handleElementAdded()
  }

  handleAddElement = (type, parentNode) =>
    this.setState({ openModal: type, parentNode: parentNode })

  handleElementAdded = () =>
    this.setState({
      openModal: null,
      treeData: this.sidebarBuilder.treeData,
    })

  handleElementSelected = ({ element }) =>
    this.setState(state => ({
      selectedElement: element,
      nodes: state.nodes.length > 0 ? state.nodes : element.code.nodes,
      links: state.links.length > 0 ? state.links : element.code.links,
    }))

  handleElementDeselected = () => {
    this.setState({
      selectedElement: null,
    })
  }

  updateType(node) {
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

  componentDidUpdate(prevProps, prevState) {
    const { selectedElement, nodes, links, prevNodes, prevLinks } = this.state
    if (
      selectedElement === prevState.selectedElement &&
      nodes.length > 0 &&
      prevNodes !== nodes &&
      prevLinks !== links &&
      selectedElement.code.nodes !== nodes &&
      selectedElement.code.links !== links
    ) {
      selectedElement.code.nodes = nodes
      selectedElement.code.links = links
      this.updateType(selectedElement)
      this.setState({
        prevNodes: nodes,
        prevLinks: links,
      })
    } else if (
      selectedElement !== prevState.selectedElement &&
      selectedElement &&
      selectedElement.code.nodes.length > 0 &&
      selectedElement.code.nodes !== nodes &&
      selectedElement.code.links !== links
    ) {
      this.setState({
        nodes: selectedElement.code.nodes,
        links: selectedElement.code.links,
      })
    }
  }

  render() {
    return (
      <Layout
        outerContainerId={this.outerContainerId}
        pageWrapId={this.pageWrapId}
        treeData={this.state.treeData}
        modals={[
          <Modal
            key={`modal-0`}
            isOpen={this.state.openModal !== null}
            onRequestClose={this.handleCloseModal}
            style={modalStyles}
          >
            <ModalInnerWrapper>{this.getModalContent()}</ModalInnerWrapper>
          </Modal>,
        ]}
        onAddElement={this.handleAddElement}
        onElementAdded={this.handleElementAdded}
        onElementSelected={this.handleElementSelected}
        onElementDeselected={this.handleElementDeselected}
      >
        <SEO title="Page three" />
        {/*<Graph
          height={this.state.height}
          width={this.state.width}
          data={{
            nodes: this.state.nodes,
            links: this.state.links,
          }}
        />*/}
        <Row>
          <EditorWrapper>
            <CodeInput
              height={100}
              width={this.state.width}
              onChange={text => {
                this.astProcessor.reset()
                try {
                  this.addNodes(CoffeeScript.nodes(text)).finally()
                } catch (e) {
                  console.error(e)
                }
              }}
            />
          </EditorWrapper>
        </Row>
        <button type={"button"} id={"reset-button"} onClick={this.reset}>
          Reset
        </button>
        <Link to="/page-2/">Go to graph page</Link>
        <Link to="/">Go back to the homepage</Link>
      </Layout>
    )
  }
}

ThirdPage.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

ThirdPage.defaultProps = {
  height: 800,
  width: 1200,
}

export default ThirdPage
