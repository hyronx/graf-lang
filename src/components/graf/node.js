import React, { useState } from "react"
import PropTypes from "prop-types"
import posed from "react-pose"
import { Group } from "@vx/group"
import {
  Position,
  Node as NodeData,
  Link as LinkData,
  SequenceNode as SequenceNodeData,
  ReportNode as ReportNodeData,
} from "graf-core"
import ReportNode from "./report-node"

const SequenceSymbol = ({ isDragging, dx, dy, node }) => (
  <Group key={`node-${node.id}`} className={`node-${node.name}`}>
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

SequenceSymbol.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  node: PropTypes.instanceOf(NodeData).isRequired,
}

const getFullHistory = node =>
  node.resultHistory
    .concat(node.errorHistory)
    .sort((a, b) => a.startTime - b.startTime)

const ReportSymbol = ({ dx, dy, node }) => {
  const [isReportHidden, setReportHidden] = useState(true)
  const [fullHistory, setFullHistory] = useState(getFullHistory(node))
  const reportViewPos = new Position(dx + 100, dy, node.column)

  return (
    <Group
      key={`node-${node.id}`}
      className={`node-${node.name}`}
      onClick={() => {
        if (isReportHidden) {
          if (
            node.resultHistory.length === 0 &&
            node.errorHistory.length === 0
          ) {
            node.run()
          }

          const history = getFullHistory(node)
          if (history !== fullHistory) setFullHistory(history)

          setReportHidden(false)
        } else {
          setReportHidden(true)
        }
      }}
    >
      <ReportNode x={dx} y={dy} />
      <Group
        className="node-report-view"
        visibility={isReportHidden ? "hidden" : "visible"}
        transform={`translate(${dx + 100}, ${dy})`}
      >
        <rect x={0} y={0} height={100} width={300} style={{ fill: "black" }} />
        {isReportHidden && (
          <text
            x={reportViewPos.x + 50}
            y={reportViewPos.y + 50}
            textAnchor={"left"}
            style={{ fill: "gold" }}
          >
            {fullHistory.length > 0
              ? JSON.stringify(fullHistory[0].data)
              : null}
          </text>
        )}
      </Group>
    </Group>
  )
}

ReportSymbol.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  node: PropTypes.instanceOf(NodeData).isRequired,
}

const DefaultSymbol = ({ isDragging, dx, dy, node, isGlowing }) => (
  <Group key={`node-${node.id}`} className={`node-${node.name}`}>
    <rect
      className={`symbol-${node.name}`}
      x={dx}
      y={dy}
      height={50}
      width={100}
      rx={5}
      stroke={isDragging ? "white" : "transparent"}
      strokeWidth={2}
      style={{ fill: isGlowing ? "green" : "black" }}
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

DefaultSymbol.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  node: PropTypes.instanceOf(NodeData).isRequired,
  isGlowing: PropTypes.bool.isRequired,
}

const renderSymbol = props => {
  if (props.node instanceof SequenceNodeData)
    return <SequenceSymbol {...props} />
  else if (props.node instanceof ReportNodeData)
    return <ReportSymbol {...props} />
  else return <DefaultSymbol {...props} />
}

const NodeWrapper = posed.g({
  draggable: true,
})

const Node = ({ node, onDragStart, onDragMove, onDragEnd }) => {
  const [isDragging, setDraggingState] = useState(false)
  const [changedValue, handleValueChange] = useState({ x: node.x, y: node.y })
  const [isGlowing, setGlowing] = useState(false)

  return (
    <NodeWrapper
      className={"vx-network-node"}
      x={node.x}
      y={node.y}
      onValueChange={{
        x: x => {
          const newValue = { ...changedValue, x }
          handleValueChange(newValue)
          onDragMove(newValue)
        },
        y: y => {
          const newValue = { ...changedValue, y }
          handleValueChange(newValue)
          onDragMove(newValue)
        },
      }}
      onDragStart={event => {
        setDraggingState(true)
        if (onDragStart) onDragStart(event)
      }}
      onDragEnd={event => {
        setDraggingState(false)
        if (onDragEnd) onDragEnd(event)
      }}
    >
      {renderSymbol({
        isDragging,
        dx: changedValue.x,
        dy: changedValue.y,
        node,
        isGlowing,
      })}
    </NodeWrapper>
  )
}

Node.propTypes = {
  dragBounds: PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  node: PropTypes.instanceOf(NodeData).isRequired,
  links: PropTypes.arrayOf(PropTypes.instanceOf(LinkData)).isRequired,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  glowTime: PropTypes.number,
}

export default Node
