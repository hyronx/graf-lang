import React from "react"
import PropTypes from "prop-types"
import { AnnotationCallout } from "react-annotation"

const white = "#ffffff"
const black = "#000000"

/**
 * @enum
 * @type {{INPUT: string, OUTPUT: string, COMMENT: string, COMMAND: string}}
 */
export const PartType = {
  INPUT: "Input",
  OUTPUT: "Output",
  COMMENT: "Comment",
  COMMAND: "Command",
}

export class OuterRimData {
  /**
   * Constructs the outer rim part data
   * @param {PartType} type - Outer rim information type
   * @param {string} label - Label to show
   * @param {number} size - Size in percent
   * @param data - Additional data
   */
  constructor(type, label, size, data = null) {
    this.type = type
    this.label = label
    this.size = size
    this.data = data
  }

  isCommentPart() {
    return this.type === PartType.COMMENT
  }

  isOutputPart() {
    return this.type === PartType.OUTPUT
  }

  isInputPart() {
    return this.type === PartType.INPUT
  }

  isCommandPart() {
    return this.type === PartType.COMMAND
  }

  createTitle() {
    let title
    if (this.isInputPart()) {
      title = `Parameter ${this.data.name}: ${this.data.type}`
    } else if (this.isOutputPart()) {
      title = `Returns ${this.data.name}: ${this.data.type}`
    } else {
      title = this.type
    }
    return title
  }
}

//const OuterRimPart = ({ arc, pie, index }) => {
export class OuterRimPart extends React.Component {
  constructor(props) {
    super(props)

    /*
    this.shouldBeAnnotated = this.props.arc.data.isCommentPart()
      || this.props.arc.data.isCommandPart()
     */

    this.state = {
      showAnnotation: false
    }
  }

  render() {
    const { arc, pie, index } = this.props
    //const shouldBeAnnotated = arc.data.isCommentPart() || arc.data.isCommandPart()
    const opacity = 1 / (index + 2)
    const [centroidX, centroidY] = pie.path.centroid(arc)
    arc.data.centroid = { x: centroidX, y: centroidY }
    const { startAngle, endAngle } = arc
    const hasSpaceForLabel = endAngle - startAngle >= 0.1

    const a = (+startAngle + +endAngle) / 2 - Math.PI / 2
    const r = (+pie.path.outerRadius()(pie) - +pie.path.innerRadius()(pie)) * 2
    const outerX = Math.cos(a) * r
    const outerY = Math.sin(a) * r
    return (
      <g className={"vx-network-node-rim-part"}>
        <g
          key={`vx-network-node-rim-${arc.data.type}-${index}`}
          onClick={() => this.setState({
            showAnnotation: !this.state.showAnnotation
          })}
        >
          <path d={pie.path(arc)} fill={white} fillOpacity={opacity}/>
          {hasSpaceForLabel && (
            <text
              className={"unselectable"}
              fill={white}
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={18}
              textAnchor="middle"
            >
              {arc.data.label}
            </text>
          )}
        </g>
        {
          //this.shouldBeAnnotated &&
          this.state.showAnnotation &&
          <AnnotationCallout

            x={outerX}
            y={outerY}
            dx={(outerX / 3) * (index + 1)}
            dy={(outerY / 3) * (index + 1)}
            color={"lightblue"}
            className={"show-bg unselectable"}
            editMode={true}
            disable={["subject"]}
            note={{
              "title": arc.data.createTitle(),
              "label": "Longer text to show text wrapping",
              "lineType": "vertical",
              "bgPadding": {
                "top": 15,
                "left": 10,
                "right": 10,
                "bottom": 10
              },
              "padding": 15,
              "titleColor": "white",
            }}
          />
        }
      </g>
    )
  }
}
