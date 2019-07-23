import React from "react"
import { Line, Pie } from "@vx/shape"
import { Drag } from "@vx/drag"
import { Group } from "@vx/group"
import { links, nodes } from "./data"
import OuterRim from "./outer-rim"
import PropTypes from "prop-types"


class Node extends React.Component {
  constructor(props) {
    super(props)

    this.afterClickDragMove = this.afterClickDragMove.bind(this)
    this.afterDoubleClickDragMove = this.afterDoubleClickDragMove.bind(this)
    this.outerRim = React.createRef()

    this.state = {
      doubleClicked: false,
      onDragMove: this.afterClickDragMove,
      line: null,
    }
  }

  afterClickDragMove({ dx, dy }) {
    const { node, onDragMove } = this.props

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

  afterDoubleClickDragMove({ dx, dy }) {
    const line = <Line
      from={{
        x: this.props.node.x,
        y: this.props.node.y,
      }}
      to={{
        x: this.props.node.x + dx,
        y: this.props.node.y + dy,
      }}
    />

    this.setState({ line })
  }

  render() {
    const { dragHeight, dragWidth, node, radius, children } = this.props
    return (
      <Drag
        key={`drag-${node.name}`}
        width={dragWidth}
        height={dragHeight}
        resetOnStart={true}
        onDragMove={this.state.onDragMove}
        onDragEnd={this.props.onDragEnd}
      >
        {({
            dragStart,
            dragEnd,
            dragMove,
            isDragging,
            dx,
            dy,
          }) => {
          return (
            <Group
              className={"vx-network-node"}
              transform={`translate(${node.x}, ${node.y})`}
            >
              <OuterRim
                ref={this.outerRim}
                x={dx}
                y={dy}
                radius={radius}
              />
              <g
                className={"vx-network-node-inner"}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
                onTouchStart={dragStart}
              >
                <circle
                  key={`circle-${node.name}`}
                  cx={dx}
                  cy={dy}
                  r={radius}
                  stroke={isDragging ? "white" : "transparent"}
                  strokeWidth={2}
                  style={{ fill: "black" }}
                />
                <text
                  className={"unselectable"}
                  x={dx}
                  y={dy + 5}
                  textAnchor={"middle"}
                  style={{ fill: "gold" }}
                  >
                  {node.name}
                </text>
              </g>
              {children.forEach(c => c({
                dragStart,
                dragEnd,
                dragMove,
                isDragging,
                dx,
                dy,
              }))}
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
  radius: PropTypes.number.isRequired,
  node: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
}

export default Node
