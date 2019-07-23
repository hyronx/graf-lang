import React from "react"
import { Group } from "@vx/group"
import PropTypes from "prop-types"
import styled from "styled-components"
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force"
import Node from "./node"
import Link from "./link"
import graph from "./data"

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

//const Graph = ({ width, height }) => {
class Graph extends React.Component {
  constructor(props) {
    super(props)

    this.onDragMoveNode = this.onDragMoveNode.bind(this)

    this.wrapper = React.createRef()

    this.state = {
      nodesOnDragEnd: [],
      ...this.props.data
    }
    this.updateForces()
  }

  addNode(node) {
    this.setState(state => ({
      nodes: [...state.nodes, node]
    }))
  }

  updateNode(node) {
    this.setState(state => ({
      nodes: state.nodes.map(n => n.name === node.name ? node : n)
    }))
  }

  addLink(link) {
    this.setState(state => ({
      links: [...state.links, link]
    }))
  }

  addNodeOnDragEnd(onDragEnd) {
    this.setState(state => ({
      nodesOnDragEnd: [...state.nodesOnDragEnd, onDragEnd]
    }))
  }

  getColumns() {
    return this.state.nodes
      .map(({ column }) => column)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  createForces(columns) {
    return columns.map(column => {
      const nodes = this.state.nodes
        .filter(n => n.column === column)
        //.map(n => Object.assign({}, n, { fx: n.x, fy: n.y }))
      return forceSimulation(nodes)
        .force("charge", forceManyBody()
          .strength(-10))
        .force("center", forceCenter()
          .x((columnWidth / 2) + (columnWidth * column))
          .y(this.props.height / 2)
        )
        .force("collide", forceCollide()
          .radius([25])
          .iterations([5]))
        .force("positioning", forceX((columnWidth / 2) + (columnWidth * column)))
    })
  }

  onDragMoveNode(node) {
    return dx => {
      const movedXPos = node.x + dx
      if (movedXPos > (node.column + 1) * columnWidth) {
        this.updateNode(Object.assign({}, node, {
          column: node.column + 1
        }))
      } else if (movedXPos < node.column * columnWidth) {
        this.updateNode(Object.assign({}, node, {
          column: node.column - 1
        }))
      }
    }
  }

  updateForces() {
    this.forces = this.createForces(this.getColumns())
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateForces()
  }

  render() {
    const { width, height } = this.props
    const columns = this.getColumns()
    return (
      <Wrapper ref={this.wrapper} width={width} height={height}>
        <rect
          width={width}
          height={height}
          rx={14}
          fill="#272b4d"
          onDoubleClick={(event) => this.addNode({
            x: event.clientX,
            y: event.clientY,
            name: "AA"
          })}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              this.addNode({
                x: Math.random() * width,
                y: Math.random() * height,
                name: Math.random() * 10 * 'A',
              })
            }
          }}
        />
        <Group className={"columns"}>
          {columns.map(column => (
            <rect
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
            {this.state.links.map(link => (
              <Group
                className="vx-network-link"
                transform="translate(0, 0)"
              >
                <Link link={link}/>
              </Group>
            ))}
          </Group>

          <Group className="vx-network-nodes">
            {this.state.nodes.map(node => (
              <Node
                dragWidth={(node.column + 1) * columnWidth}
                dragHeight={height}
                radius={25}
                node={node}
                onDragMove={this.onDragMoveNode(node)}
                onDragEnd={() => {
                  this.forces.forEach(f => f.stop())
                }}
              >
                {({ onDragEnd }) => this.addNodeOnDragEnd(onDragEnd)}
              </Node>
            ))}
          </Group>
        </Group>
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
}

Graph.defaultProps = {
  data: graph
}

export default Graph
