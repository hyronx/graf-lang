import styled from "styled-components"
import React from "react"
//import { LinkHorizontal, LinkRadial } from "@vx/shape"

const ConnectingLine = styled.line`
  strokeWidth: 2;
  stroke: #999;
  strokeOpacity: 0.6;
`

class Link extends React.Component {
  constructor(props) {
    super(props)


    this.state = {
      x1: this.props.link.source.x,
      y1: this.props.link.source.y,
      x2: this.props.link.target.x,
      y2: this.props.link.target.y,
    }

    //this.state = Object.assign({}, this.props.link)
    this.props.link.component = this
  }

  update({ source, target }) {
    let newLink = {}
    if (source) {

      newLink.x1 = source.x
      newLink.y1 = source.y

      //newLink.source = source
    }

    if (target) {

      newLink.x2 = target.x
      newLink.y2 = target.y

      //newLink.target = target
    }

    this.setState(newLink)
  }

  render() {
    return (
      /*
      <LinkHorizontal
        data={this.state}
        stroke="#374469"
        strokeWidth="1"
        fill="none"
        key={JSON.stringify(this.props.link.target + this.props.link.target)}
      />
      */
      <ConnectingLine {...this.state} />
    )
  }
}

export default Link
