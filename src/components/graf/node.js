import React from "react"
import { Drag } from "@vx/drag"
import { Group } from "@vx/group"
import PropTypes from "prop-types"
import ReportNode from "./report-node"
import { Position } from "../../services/position"


class Node extends React.Component {
  constructor(props) {
    super(props)

    this.afterClickDragMove = this.afterClickDragMove.bind(this)
    this.handleResultNodeClick = this.handleResultNodeClick.bind(this)

    this.props.node.onRunning = this.handleNodeRunning.bind(this)
    this.props.node.onFinished = this.handleNodeRunning.bind(this)

    this.state = {
      doubleClicked: false,
      line: null,
      hideReport: true,
      report: true,
      glow: false,
      glowTime: this.props.glowTime || 3000,
    }
  }

  afterClickDragMove({ dx, dy }) {
    const { node, onDragMove, links } = this.props

    const nodeAsSourceLinks = links.filter(({ source }) =>
      node.name === source.name
    )
    for (let link of nodeAsSourceLinks) {
      const { x, y } = this.outerRim.current.props.data
        .find(d => d.isOutputPart())
        .centroid

      link.component.update({
        source: {
          name: node.name,
          x: x + node.x + dx,
          y: y + node.y + dy,
        },
      })
    }

    const nodeAsTargetLinks = links.filter(({ target }) =>
      node.name === target.name
    )
    for (let link of nodeAsTargetLinks) {
      const { x, y } = this.outerRim.current.props.data
        .find(d => d.isInputPart())
        .centroid

      link.component.update({
        target: {
          name: node.name,
          x: x + node.x + dx,
          y: y + node.y + dy,
        },
      })
    }

    if (onDragMove !== undefined) onDragMove(dx, dy)
  }

  async handleNodeRunning() {
    await new Promise(resolve =>
      setTimeout(resolve, this.state.glowTime)
    )
    return this.setState(({ glow, glowTime }) => ({
      glow: !glow,
      glowTime: glowTime + (glow ? -1000 : 1000)
    }))
  }

  handleResultNodeClick(reportViewPos) {
    this.setState(state => {
      if (state.hideReport) {
        const { node } = this.props
        if (node.resultHistory.length === 0 && node.errorHistory.length === 0) {
          node.run()
        }

        const fullHistory = node.resultHistory.concat(node.errorHistory)
          .sort((a, b) => a.startTime - b.startTime)

        return {
          hideReport: false,
          report: (
            <text
              x={reportViewPos.x / 3}
              y={reportViewPos.y / 3}
              textAnchor={"left"}
              style={{ fill: "gold" }}
            >
              {fullHistory.length > 0
                ? fullHistory[0].data
                : null
              }
            </text>
          )
        }
      } else {
        return { hideReport: true }
      }
    })
  }

  /**
   * Renders the symbol based on the name
   * @param {boolean} isDragging
   * @param {number} dx
   * @param {number} dy
   * @param {Node} node
   * @returns {*} the symbol as a React component
   */
  renderSymbol(isDragging, dx, dy, node) {
    switch (node.name) {
      case "·":
        return (
          <Group
            key={`node-${node.id}`}
            className={`node-${node.name}`}
          >
            <circle
              className={`symbol-${node.name}`}
              cx={dx + 50}
              cy={dy + 25}
              r={10}
              stroke={isDragging ? "white" : "transparent"}
              strokeWidth={2}
              style={{ fill: "black" }}
            />
          </Group>
        )
      case "#>":
        return (
          <Group
            key={`node-${node.id}`}
            className={`node-${node.name}`}
            onClick={() =>
              this.handleResultNodeClick(new Position(
                dx + 100,
                dy,
                node.column
              ))
            }
          >
            <ReportNode x={dx} y={dy} />
            <Group
              className="node-report-view"
              visibility={this.state.hideReport ? "hidden" : "visible"}
              transform={`translate(${dx + 100}, ${dy})`}
            >
              <rect
                x={0}
                y={0}
                height={100}
                width={300}
                style={{ fill: "black" }}
              />
              {this.state.report}
            </Group>
          </Group>
        )
      default:
        return (
          <Group
            key={`node-${node.id}`}
            className={`node-${node.name}`}
          >
            <rect
              className={`symbol-${node.name}`}
              x={dx}
              y={dy}
              height={50}
              width={100}
              rx={5}
              stroke={isDragging ? "white" : "transparent"}
              strokeWidth={2}
              style={{ fill: this.state.glow ? "green" : "black" }}
            />
            <text
              className={"unselectable"}
              x={dx + 50 / 3}
              y={dy + 100 / 3}
              textAnchor={"middle"}
              style={{ fill: "gold" }}
            >
              {node.name}
            </text>
          </Group>
        )
    }
  }

  render() {
    const { dragHeight, dragWidth, node, children } = this.props
    return (
      <Drag
        key={`drag-${node.name}`}
        width={dragWidth}
        height={dragHeight}
        resetOnStart={true}
        onDragMove={this.afterClickDragMove}
        onDragEnd={this.props.onDragEnd}
      >
        {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) => {
          return (
            <Group
              className={"vx-network-node"}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseDown={dragStart}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
              onTouchStart={dragStart}
            >
              {this.renderSymbol(isDragging, dx, dy, node)}
              {children &&
                children.forEach(c => c({
                  dragStart,
                  dragEnd,
                  dragMove,
                  isDragging,
                  dx,
                  dy,
                }))
              }
            </Group>
          )
        }}
      </Drag>
    )
  }
}

Node.propTypes = {
  dragWidth: PropTypes.number.isRequired,
  dragHeight: PropTypes.number.isRequired,
  node: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  links: PropTypes.array.isRequired,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  glowTime: PropTypes.number,
}

export default Node
