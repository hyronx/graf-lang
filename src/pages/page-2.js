import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Graph from "../components/graphx"

const graphHeight = 800
const graphWidth = 1200

class SecondPage extends React.Component {
  constructor(props) {
    super(props)

    this.graph = React.createRef()
  }


  render() {
    return (
      <Layout>
        <SEO title="Page two"/>
        <div>
          <Graph ref={this.graph} height={graphHeight} width={graphWidth} />
        </div>
        <Link to="/page-3/">Go to tree page</Link>
        <Link to="/">Go back to the homepage</Link>
      </Layout>
    )
  }
}

export default SecondPage
