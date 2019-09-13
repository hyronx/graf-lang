// @flow

import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Group } from "@vx/group"
import { Tree } from "@vx/hierarchy"
import { Arc, LinkHorizontal } from "@vx/shape"
import { LinearGradient } from "@vx/gradient"
import { hierarchy } from "d3-hierarchy"
import { Type } from "graf-core"
import useClickPreventionOnDoubleClick from "../utils/click"

const peach = "#fd9b93"
const pink = "#fe6e9e"
const blue = "#03c0dc"
const green = "#26deb0"
const plum = "#71248e"
const lightpurple = "#374469"
const white = "#ffffff"
const bg = "#272b4d"

const traverseToRoot = (startNode, callback) => {
  let current = startNode
  let path = [current]
  while (current.parent) {
    callback(current.parent)
    path = [current.parent, ...path]
    current = current.parent
  }
  return path
}

// eslint-disable-next-line
function Node({ node, onSelect, onDeselect, onAddElement }) {
  const width = 40
  const height = 20
  const centerX = -width / 2
  const centerY = -height / 2
  const isRoot = node.depth === 0
  const isParent = !!node.children
  const handleClick = () => {
    if (!isSelected) onSelect(node)
    else onDeselect(node)

    setIsSelected(!isSelected)
  }

  const [isSelected, setIsSelected] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [
    handleNodeClick,
    handleNodeDoubleClick,
  ] = useClickPreventionOnDoubleClick(handleClick, onAddElement)

  useEffect(() => {
    if (clicked) {
      handleClick()
      setClicked(false)
    }
  }, [clicked])

  node.setIsSelected = setIsSelected

  if (isRoot) {
    return (
      <RootNode node={node} onClick={handleClick}>
        {isSelected && (
          <Arc
            outerRadius={20}
            innerRadius={12}
            startAngle={0}
            endAngle={Math.PI * 2}
            fill={lightpurple}
            opacity={0.9}
          />
        )}
      </RootNode>
    )
  }
  if (isParent) {
    return (
      <ParentNode node={node} onClick={handleClick}>
        {isSelected && (
          <Arc
            outerRadius={20}
            innerRadius={12}
            startAngle={0}
            endAngle={Math.PI * 2}
            fill={lightpurple}
            opacity={0.9}
          />
        )}
      </ParentNode>
    )
  }

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={bg}
        stroke={green}
        strokeWidth={1}
        strokeDasharray={"2,2"}
        strokeOpacity={0.6}
        rx={10}
        onClick={handleNodeClick}
        onDoubleClick={handleNodeDoubleClick}
      />
      <text
        dy={".33em"}
        fontSize={9}
        fontFamily="Arial"
        textAnchor={"middle"}
        fill={green}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {node.data.name}
      </text>
      {isSelected && (
        <rect
          height={height + 10}
          width={width + 10}
          y={centerY - 5}
          x={centerX - 5}
          fill="none"
          stroke={lightpurple}
          strokeWidth={10}
          strokeDasharray={"2,0"}
          strokeOpacity={0.9}
          rx={10}
        />
      )}
    </Group>
  )
}

// eslint-disable-next-line
function RootNode({ node, onClick, children }) {
  return (
    <Group top={node.x} left={node.y}>
      <circle r={12} fill="url('#lg')" onClick={onClick} />
      <text
        dy={".33em"}
        fontSize={9}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        fill={plum}
      >
        {node.data.name}
      </text>
      {children}
    </Group>
  )
}

// eslint-disable-next-line
function ParentNode({ node, onClick, children }) {
  const width = 40
  const height = 20
  const centerX = -width / 2
  const centerY = -height / 2

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={bg}
        stroke={blue}
        strokeWidth={1}
        onClick={onClick}
      />
      <text
        dy={".33em"}
        fontSize={9}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        fill={white}
      >
        {node.data.name}
      </text>
      {children}
    </Group>
  )
}

const convertToHierarchy = (types: Type[]) => {
  const tree = {
    name: "#",
    children: [],
  }
  for (const type of types) {
    switch (type.typeName) {
      case "Operation":
        tree.children.push({
          ...type,
        })
        break
      case "Class":
        tree.children.push({
          ...type,
          children: type.methods,
        })
        break
      default:
        break
    }
  }
  return hierarchy(tree)
}

const Sidebar = ({
  elements,
  width,
  height,
  margin = {
    top: 10,
    left: 30,
    right: 40,
    bottom: 80,
  },
  onSelect,
  onDeselect,
  onAddElement,
}) => {
  const data = convertToHierarchy(elements)
  const yMax = height - margin.top - margin.bottom
  const xMax = width - margin.left - margin.right

  return (
    <svg width={width} height={height}>
      <LinearGradient id="lg" from={peach} to={pink} />
      <rect width={width} height={height} rx={14} fill={bg} />
      <Tree root={data} size={[yMax, xMax]}>
        {tree => {
          return (
            <Group top={margin.top} left={margin.left}>
              {tree.links().map((link, i) => {
                return (
                  <LinkHorizontal
                    key={`link-${i}`}
                    data={link}
                    stroke={lightpurple}
                    strokeWidth="1"
                    fill="none"
                  />
                )
              })}
              {tree.descendants().map((node, i) => {
                return (
                  <Node
                    key={`node-${i}`}
                    node={node}
                    onSelect={() => {
                      tree.descendants().forEach(n => n.setIsSelected(false))
                      const path = traverseToRoot(node, n =>
                        n.setIsSelected(true)
                      )
                      if (onSelect) onSelect(path)
                    }}
                    onDeselect={() => {
                      const path = traverseToRoot(node, n =>
                        n.setIsSelected(false)
                      )
                      if (onDeselect) onDeselect(path)
                    }}
                    onAddElement={() => {
                      if (onAddElement)
                        onAddElement(node.data.typeName, node.data)
                    }}
                  />
                )
              })}
            </Group>
          )
        }}
      </Tree>
    </svg>
  )
}

export default Sidebar

Sidebar.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.instanceOf(Type)).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
  }),
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onAddElement: PropTypes.func,
}
