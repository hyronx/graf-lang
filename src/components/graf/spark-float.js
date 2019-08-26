import React from "react"
import PropTypes from "prop-types"
import { Node, Link, LinkType } from "graf-core"
import Spark from "./spark"

export default class SparkFloat extends React.Component {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Node)).isRequired,
    links: PropTypes.arrayOf(PropTypes.instanceOf(Link)).isRequired,
    show: PropTypes.bool.isRequired,
    duration: PropTypes.number.isRequired,
  }

  static defaultProps = {
    duration: 4000,
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0,
      nodes: this.getSortedNodes(this.props),
      sparkDirections: [{ dx: 0, dy: 0 }],
    }
  }

  getSortedNodes(props) {
    //return props.nodes.slice(0).sort((a, b) => b.execStep - a.execStep)
    const rootNode = props.nodes.find(node => node.isRoot())
    if (rootNode) {
      const stack = [rootNode]
      const otherNodes = []
      while (stack.length > 0) {
        const node = stack.pop()
        otherNodes.push(node)

        const nextNodes = node.nextNodes.slice(0)
        const nextRightNode = node.nextRightNode
        if (nextRightNode && nextRightNode !== nextNodes[0]) {
          const index = nextNodes.indexOf(nextRightNode)
          nextNodes.copyWithin(0, index, index + 1)
        }
        for (let i = nextNodes.length - 1; i >= 0; i--) {
          stack.push(nextNodes[i])
        }
      }

      return otherNodes
    } else {
      return []
    }
  }

  setDeltas() {
    const { currentIndex: index, nodes } = this.state
    let nextLink = this.props.links.find(
      link =>
        link.sourceNode === nodes[index] && link.targetNode === nodes[index + 1]
    )
    if (!nextLink) {
      nextLink = this.props.links.find(
        link =>
          link.sourceNode === nodes[index + 1].previousNode &&
          link.targetNode === nodes[index + 1]
      )
    }

    let deltas
    switch (nextLink.type) {
      case LinkType.LEFT_TO_RIGHT:
        deltas = [
          {
            dx: nodes[index + 1].leftCenter.x - nodes[index].rightCenter.x,
            dy: 0,
          },
        ]
        break
      case LinkType.BOTTOM_TO_TOP:
        deltas = [
          {
            dx: 0,
            dy: nodes[index + 1].topCenter.y - nodes[index].bottomCenter.y,
          },
        ]
        break
      case LinkType.BOTTOM_TO_DEEPER_RIGHT:
        deltas = [
          {
            dx: 0,
            dy: nodes[index + 1].center.y - nodes[index].bottomCenter.y,
          },
          {
            dx: nodes[index + 1].leftCenter.x - nodes[index].center.x,
            dy: 0,
          },
        ]
        break
      case LinkType.LEFT_TO_DEEPER_RIGHT:
        deltas = [
          {
            dx: -20,
            dy: 0,
          },
          {
            dx: 0,
            dy: nodes[index + 1].center.y - nodes[index].center.y,
          },
          {
            dx: 20,
            dy: 0,
          },
        ]
        break
      case LinkType.LEFT_TO_DEEPER_LEFT_TOP:
        deltas = [
          {
            dx: -20,
            dy: 0,
          },
          {
            dx: 0,
            dy: nodes[index + 1].center.y - nodes[index].center.y,
          },
        ]
        break
      default:
        deltas = []
        break
    }
    this.setState({
      sparkDirections: deltas,
      currentIndex: index < nodes.length - 1 ? index + 1 : 0,
    })
  }

  updateSpark() {
    const { sparkDirections, currentIndex: index, nodes } = this.state
    if (sparkDirections.length === 0) {
      this.setDeltas()
    } else {
      const [, ...remainingDirections] = sparkDirections
      if (remainingDirections.length === 0 && index < nodes.length - 1)
        this.setDeltas()
      else if (remainingDirections.length === 0) null
      //this.setState({ currentIndex: 0 })
      else this.setState({ sparkDirections: remainingDirections })
    }
  }

  componentDidUpdate(prevProps) {
    const { nodes } = this.props
    if (prevProps.nodes !== nodes) {
      setTimeout(() => {
        this.setState(
          { nodes: this.getSortedNodes(this.props) },
          nodes.length > 0 ? this.updateSpark : undefined
        )
      }, this.props.duration)
    } else if (nodes.length > 0) {
      setTimeout(() => {
        this.updateSpark()
      }, this.props.duration)
    }
  }

  render() {
    const { sparkDirections, nodes, currentIndex } = this.state
    return (
      <Spark
        key="spark"
        show={this.props.show}
        dx={sparkDirections[0].dx}
        dy={sparkDirections[0].dy}
        cx={nodes.length > 0 ? nodes[currentIndex].center.x : 0}
        cy={nodes.length > 0 ? nodes[currentIndex].center.y : 0}
        //duration={this.props.duration}
      />
    )
  }
}
