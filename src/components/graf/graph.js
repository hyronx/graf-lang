import React from "react"
import { Group } from "@vx/group"
import PropTypes from "prop-types"
import styled from "styled-components"
import posed, { PoseGroup } from "react-pose"
import { easeExpOut } from "d3-ease"
import theme from "../../../config/theme"
import Node from "./node"
import Link from "./link"
import Spark from "./spark"

const Wrapper = styled.svg`
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`

const columnWidth = 300

class Graph extends React.Component {
  getColumns() {
    return this.props.data.nodes
      .map(({ column }) => column)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  onDragMoveNode = node => {
    return dx => {
      const movedXPos = node.x + dx
      if (movedXPos > (node.column + 1) * columnWidth) {
        this.props.onUpdateNode(
          Object.assign({}, node, {
            column: node.column + 1,
          })
        )
      } else if (movedXPos < node.column * columnWidth) {
        this.props.onUpdateNode(
          Object.assign({}, node, {
            column: node.column - 1,
          })
        )
      }
    }
  }

  get isEmpty() {
    return (
      this.props.data.nodes.length === 0 && this.props.data.links.length === 0
    )
  }

  get lastNode() {
    return this.props.data.nodes[this.props.data.nodes.length - 1]
  }

  render() {
    const {
      width,
      height,
      data: { nodes, links },
      onAddNode,
    } = this.props
    const columns = this.getColumns()

    return (
      <Wrapper width={width} height={height}>
        <rect
          width={width}
          height={height}
          rx={15}
          fill={theme.colors.dark.board.background}
          onDoubleClick={event =>
            onAddNode({
              x: event.clientX,
              y: event.clientY,
              name: "AA",
            })
          }
          onKeyDown={event => {
            if (event.keyCode === 13) {
              onAddNode({
                x: Math.random() * width,
                y: Math.random() * height,
                name: Math.random() * 10 * "A",
              })
            }
          }}
        />
        <Group className={"columns"}>
          {columns.map(column => (
            <rect
              key={`column-${column}`}
              width={columnWidth}
              height={height}
              x={column * columnWidth}
              rx={5}
              stroke={"gray"}
              strokeWidth={3}
              fillOpacity={0.1}
            />
          ))}
        </Group>
        <Group className="vx-network">
          <Group className="vx-network-links">
            {links.map((link, i) => (
              <Group
                key={`vx-network-link-${i}`}
                className="vx-network-link"
                transform="translate(0, 0)"
              >
                <Link link={link} />
              </Group>
            ))}
          </Group>

          <Group className="vx-network-nodes">
            {nodes.map((node, i) => (
              <Node
                key={`vx-network-node-${i}`}
                dragWidth={(node.column + 1) * columnWidth}
                dragHeight={height}
                radius={25}
                node={node}
                links={links}
                onDragMove={this.onDragMoveNode(node)}
              />
            ))}
          </Group>
        </Group>
        <Spark
          key="spark"
          show={!this.isEmpty}
          dx={!this.isEmpty ? this.lastNode.nextNodes[0].leftCenter.x - this.lastNode.rightCenter.x : 0}
          cx={!this.isEmpty ? this.lastNode.rightCenter.x : 0}
          cy={!this.isEmpty ? this.lastNode.rightCenter.y : 0}
        />
      </Wrapper>
    )
  }
}

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.shape({
    links: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired,
  }).isRequired,
  onAddNode: PropTypes.func.isRequired,
  onUpdateNode: PropTypes.func.isRequired,
}

Graph.defaultProps = {
  onAddNode: () => {},
  onUpdateNode: () => {},
}

export default Graph
