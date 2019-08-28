import React, { useEffect } from "react"
import { Link } from "gatsby"
import Rete from "rete"
import ConnectionPlugin from "rete-connection-plugin"
import ReactRenderPlugin from "rete-react-render-plugin"
import ContextMenuPlugin from "rete-context-menu-plugin"
import Layout from "../components/layout"
import SEO from "../components/seo"

const numberSocket = new Rete.Socket("Number value")

class NumberComponent extends Rete.Component {
  constructor() {
    super("Number")
  }

  builder(node) {
    const out = new Rete.Output("first", "Number", numberSocket)
    return node.addOutput(out)
  }

  worker(node, inputs, outputs) {
    outputs["first"] = node.data.first
  }
}

const SecondPage = props => {
  useEffect(() => {
    async function init() {
      const container = document.querySelector("#rete")
      const editor = new Rete.NodeEditor("demo@0.1.0", container)

      editor.use(ConnectionPlugin)
      editor.use(ReactRenderPlugin)
      editor.use(ContextMenuPlugin)

      const numComponent = new NumberComponent()
      editor.register(numComponent)

      const engine = new Rete.Engine("demo@0.1.0")
      engine.register(numComponent)

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
  })

  return (
    <Layout>
      <SEO title="Page two" />
      <div style={{ width: 800, height: 600 }}>
        <div id="rete"></div>
      </div>
      <Link to="/page-3/">Go to tree page</Link>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default SecondPage
