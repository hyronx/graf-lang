import React, { useState, useEffect, Fragment } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import MainMenu from "./components/main-menu"
import NodeMenu from "./components/node-menu"
import { createNode } from "./utils"

const documentGlobal = typeof document !== "undefined" ? document : undefined

const sortComponents = components => {
  const itemGroups = {}
  for (const component of components) {
    if (itemGroups[component.nodeType]) {
      itemGroups[component.nodeType].push({
        label: component.name,
        value: component,
      })
    } else {
      itemGroups[component.nodeType] = [
        {
          label: component.name,
          value: component,
        },
      ]
    }
  }
  return Object.entries(itemGroups)
    .sort((a, b) => a[0] < b[0])
    .map(([nodeType, items]) => ({
      label: nodeType,
      options: items.sort((a, b) => a.label < b.label),
    }))
}

const Menu = ({ editor, params }) => {
  const [showMainMenu, setShowMainMenu] = useState(false)
  const [nodeMenuData, setNodeMenuData] = useState(null)

  useEffect(() => {
    editor.bind("hidecontextmenu")
    editor.bind("showcontextmenu")

    editor.on("hidecontextmenu", () => {
      if (showMainMenu) setShowMainMenu(false)
      if (nodeMenuData !== null) setNodeMenuData(null)
    })

    editor.on("click contextmenu", () => {
      editor.trigger("hidecontextmenu")
    })

    editor.on("contextmenu", ({ e, node }) => {
      e.preventDefault()
      e.stopPropagation()

      if (!editor.trigger("showcontextmenu", { e, node })) return

      if (node) {
        const [x, y] = [e.clientX, e.clientY]
        setNodeMenuData({ x, y, node })
      } else {
        setShowMainMenu(true)
      }
    })
  }, [])

  return (
    <Fragment>
      <MainMenu
        show={showMainMenu}
        onHide={() => setShowMainMenu(false)}
        editor={editor}
        items={sortComponents(editor.components.values())}
        selectProps={{
          menuPortalTarget: documentGlobal.body,
        }}
      />
      <NodeMenu
        show={nodeMenuData !== null}
        position={nodeMenuData}
        onHide={() => setNodeMenuData(null)}
        editor={editor}
        items={[
          {
            label: "Delete",
            value: () => editor.removeNode(nodeMenuData.node),
          },
          {
            label: "Clone",
            value: async () => {
              const {
                name,
                position: [x, y],
                ...params
              } = nodeMenuData.node
              const component = editor.components.get(name)
              const node = await createNode(component, {
                ...params,
                x: x + 10,
                y: y + 10,
              })

              editor.addNode(node)
            },
          },
        ]}
        selectProps={{
          menuPortalTarget: documentGlobal.body,
        }}
      />
    </Fragment>
  )
}

Menu.propTypes = {
  editor: PropTypes.object.isRequired,
  params: PropTypes.object,
}

function install(editor, params) {
  const el = documentGlobal.createElement("div")
  documentGlobal.body.appendChild(el)

  ReactDOM.render(<Menu editor={editor} params={params} />, el)
}

export default {
  name: "graf-context-menu",
  install,
}
