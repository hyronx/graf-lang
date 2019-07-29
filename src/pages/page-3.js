import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import styled from "styled-components"
import { max } from "d3-array"
import Layout from "../components/layout"
import SEO from "../components/seo"
import CoffeeScript from "coffeescript"
import Graph from "../components/graf"
import ASTProcessor from "../services/ast-processor"
import CodeInput from "../components/code-input"
import executeNodesAsync from "../services/node-executer"

const Wrapper = styled.div`
  .terminal-base {
    min-height: 200px;
    max-height: 200px;
  }

  height: 200px;
`

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
    }
  }

  componentDidUpdate() {
    console.log(this.state)
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

  render() {
    return (
      <Layout
        outerContainerId={this.outerContainerId}
        pageWrapId={this.pageWrapId}
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
        <Wrapper>
          <CodeInput
            onChange={text => {
              this.astProcessor.reset()
              try {
                this.addNodes(CoffeeScript.nodes(text)).finally()
              } catch (e) {
                console.error(e)
              }
            }}
          />
        </Wrapper>
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
