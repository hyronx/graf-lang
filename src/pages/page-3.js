import React from "react"
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

//const ThirdPage = () =>
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

  async addNodes(newNodes) {
    await this.setState(async () => {
      this.astProcessor.process(newNodes)
      console.log(this.astProcessor.nodes)

      const lastNode = this.astProcessor.nodes[this.astProcessor.nodes.length - 1]
      await executeNodesAsync(lastNode, {
        onWillRun(node, args) {
          console.log(`Node ${this.current} called with:`, args)
        },
        onHasRun(node, args, result) {
          console.log(`Node ${this.current} returning:`, result)
        }
      })

      return {
        height: max(this.astProcessor.nodes.map(n => n.y)) + 200,
        width: max(this.astProcessor.nodes.map(n => n.x)) + 200,
        nodes: this.astProcessor.nodes,
        links: this.astProcessor.links,
      }
    })
    console.log(this.state)
  }

  reset() {
    this.setState(() => {
      this.astProcessor.reset()
      return {
        nodes: [],
        links: [],
        height: this.props.height,
        width: this.props.width,
      }
    })
  }

  render() {
    return (
      <Layout outerContainerId={this.outerContainerId} pageWrapId={this.pageWrapId}>
        <SEO title="Page three"/>
        <Graph
          height={this.state.height}
          width={this.state.width}
          data={{
            nodes: this.state.nodes,
            links: this.state.links,
          }}
        />
        <Wrapper>
          <CodeInput onChange={(text) => {
            this.astProcessor.reset()
            try {
              this.addNodes(CoffeeScript.nodes(text)).finally()
            } catch (e) {
              console.error(e)
            }
          }}/>
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

ThirdPage.defaultProps = {
  height: 800,
  width: 1200,
}

export default ThirdPage
