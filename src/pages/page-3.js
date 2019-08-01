import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"
import Modal from "react-modal"
import { max } from "d3-array"
import { Row, Col } from "react-flexbox-grid"
import Layout from "../components/layout"
import ClassField from "../components/class-field"
import SEO from "../components/seo"
import CoffeeScript from "coffeescript"
import Graph from "../components/graf"
import CodeInput from "../components/code-input"
import { executeNodesAsync, ASTProcessor } from "graf-core"
import theme from "../../config/theme"

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
    width: "300px",
    height: "500px",
    backgroundColor: theme.colors.dark.default.paper,
  },
}

class ThirdPage extends React.Component {
  constructor(props) {
    super(props)

    this.reset = this.reset.bind(this)

    this.graph = React.createRef()
    this.astProcessor = new ASTProcessor()
    this.outerContainerId = "outer-container"
    this.pageWrapId = "page-wrap"

    this.state = {
      nodes: [],
      links: [],
      height: this.props.height,
      width: this.props.width,
      isModalOpen: false,
    }
  }

  async addNodes(newNodes) {
    this.astProcessor.process(newNodes)
    console.log(
      "Nodes sorted:",
      this.astProcessor.nodes
        .filter(n => n.isRunnable)
        .sort((a, b) => a.execStep - b.execStep)
    )

    const lastNode = this.astProcessor.nodes[this.astProcessor.nodes.length - 1]

    await executeNodesAsync(lastNode, {
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
          height: max(this.astProcessor.nodes.map(n => n.y)) + 200,
          width: max(this.astProcessor.nodes.map(n => n.x)) + 200,
          nodes: this.astProcessor.nodes,
          links: this.astProcessor.links,
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

  handleCloseModal = () => this.setState({ isModalOpen: false })

  render() {
    return (
      <Layout
        outerContainerId={this.outerContainerId}
        pageWrapId={this.pageWrapId}
        modals={[
          <Modal
            key={`modal-0`}
            isOpen={this.state.isModalOpen}
            onRequestClose={this.handleCloseModal}
            style={modalStyles}
          >
            <ClassField isExpanded={true} isEditable={true} isBoxed={true} />
          </Modal>,
        ]}
        onAddElement={type => this.setState({ isModalOpen: true })}
      >
        <SEO title="Page three" />
        <Graph
          height={this.state.height}
          width={this.state.width}
          data={{
            nodes: this.state.nodes,
            links: this.state.links,
          }}
        />
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
