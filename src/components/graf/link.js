import styled from "styled-components"
import React from "react"
import { LinkHorizontal } from "@vx/shape"
import { Group } from "@vx/group"
import { LinkType } from "graf-core"

const ConnectingLine = styled.line`
  strokewidth: 2;
  stroke: #999;
  strokeopacity: 0.6;
`

class Link extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      x1: this.props.link.source.x,
      y1: this.props.link.source.y,
      x2: this.props.link.target.x,
      y2: this.props.link.target.y,
      type: this.props.link.type,
    }

    this.props.link.component = this
  }

  update({ source, target }) {
    let newLink = {}
    if (source) {
      newLink.x1 = source.x
      newLink.y1 = source.y
    }

    if (target) {
      newLink.x2 = target.x
      newLink.y2 = target.y
    }

    this.setState(newLink)
  }

  render() {
    switch (this.state.type) {
      case LinkType.LEFT_TO_RIGHT:
        return (
          <Group className={`vx-link-${this.state.type}`}>
            <ConnectingLine {...this.state} />
          </Group>
        )
      case LinkType.BOTTOM_TO_TOP:
        return (
          <Group className={`vx-link-${this.state.type}`}>
            <ConnectingLine
              x1={this.state.x1}
              y1={this.state.y1}
              x2={this.state.x2}
              y2={this.state.y2}
            />
          </Group>
        )
      case LinkType.BOTTOM_TO_DEEPER_RIGHT:
        return (
          <Group className={`vx-link-${this.state.type}`}>
            <ConnectingLine
              x1={this.state.x1}
              y1={this.state.y1}
              x2={this.state.x2 - 20}
              y2={this.state.y2}
            />
            <ConnectingLine
              x1={this.state.x2 - 20}
              y1={this.state.y2}
              x2={this.state.x2}
              y2={this.state.y2}
            />
          </Group>
        )
      case LinkType.LEFT_TO_DEEPER_RIGHT:
        return (
          <Group className={`vx-link-${this.state.type}`}>
            <ConnectingLine
              x1={this.state.x1}
              y1={this.state.y1}
              x2={this.state.x2 - 20}
              y2={this.state.y2}
            />
            <ConnectingLine
              x1={this.state.x2 - 20}
              y1={this.state.y2}
              x2={this.state.x2}
              y2={this.state.y2}
            />
          </Group>
        )
      case LinkType.LEFT_TO_DEEPER_LEFT_TOP:
        return (
          <Group className={`vx-link-${this.state.type}`}>
            <ConnectingLine
              x1={this.state.x1}
              y1={this.state.y1}
              x2={this.state.x2}
              y2={this.state.y2}
            />
          </Group>
        )
      default:
        return null
    }
  }
}

export default Link
