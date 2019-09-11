import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Rete from "rete"
import ConnectionPlugin from "rete-connection-plugin"
import ReactRenderPlugin from "rete-react-render-plugin"
import ContextMenuPlugin from "../components/rete-context-menu"

import {
  NumberComponent,
  TextComponent,
  VariableComponent,
  FunctionComponent,
  ArrayComponent,
  ReferenceComponent,
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
import ContextMenu from "../components/context-menu"

const components = [
  new NumberComponent(),
  new TextComponent(),
  new VariableComponent(),
  new FunctionComponent(),
  new ArrayComponent(),
  new ReferenceComponent(),
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

const SecondPage = props => {
  useEffect(() => {
    async function init() {
      const container = document.querySelector("#rete")
      const editor = new Rete.NodeEditor("graf@0.1.0", container)

      editor.use(ConnectionPlugin)
      editor.use(ReactRenderPlugin)
      editor.use(ContextMenuPlugin)

      const engine = new Rete.Engine("graf@0.1.0")
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
  })

  /*
  const [contextMenuInfo, setContextMenuInfo] = useState({
    show: false,
    cx: 0,
    cy: 0,
  })
  */

  return (
    <Layout>
      <SEO title="Page two" />
      <ReteWrapper>
        <div id="rete"></div>
      </ReteWrapper>
      {/*<div
        style={{
          width: 500,
          height: 500,
          borderStyle: "solid",
          borderColor: "black",
          borderWidth: "2px",
        }}
        onClick={() => setContextMenuInfo({ show: false })}
        onContextMenu={({ nativeEvent }) => {
          nativeEvent.preventDefault()
          setContextMenuInfo({
            show: !contextMenuInfo.show,
            cx: nativeEvent.offsetX,
            cy: nativeEvent.offsetY,
          })
          return false
        }}
      >
        <ContextMenu
          innerCircle={{
            ...contextMenuInfo,
            r: 20,
          }}
          show={contextMenuInfo.show}
          onShow={event => {
            event.preventDefault()
            setContextMenuInfo({ show: true })
            return false
          }}
          onHide={() => setContextMenuInfo({ show: false })}
        />
      </div>*/}
      <Link to="/page-3/">Go to tree page</Link>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default SecondPage
