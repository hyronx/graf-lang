import React from "react"
import { Group } from "@vx/group"
import { Pie } from "@vx/shape"
import PropTypes from "prop-types"
import { OuterRimPart, OuterRimData, PartType } from "./outer-rim-part"

class OuterRim extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { x, y, data, radius } = this.props
    return (
      <Group
        className={"vx-network-node vx-network-node-rim"}
        transform={`translate(${x}, ${y})`}
      >
        <Pie
          data={data}
          pieValue={d => d.size}
          pieSort={() => 0}
          startAngle={Math.PI * 0.1}
          endAngle={2 * Math.PI + Math.PI * 0.1}
          outerRadius={radius + 40}
          innerRadius={radius + 10}
          cornerRadius={2}
          padAngle={0}
        >
          {pie => pie.arcs.map((arc, i) => {
            return (
              <OuterRimPart arc={arc} pie={pie} index={i} />
            )
          })}
        </Pie>
      </Group>
    )
  }
}

OuterRim.propTypes = {
  radius: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.instanceOf(OuterRimData)).isRequired,
}

OuterRim.defaultProps = {
  x: 0,
  y: 0,
  data: [
    new OuterRimData(PartType.OUTPUT, "·", 0.4, {
      "name": "url",
      "type": "String",
    }),
    new OuterRimData(PartType.COMMENT, "#", 0.1),
    new OuterRimData(PartType.INPUT, "+", 0.4, {
      "name": "protocol",
      "type": "String",
    }),
    new OuterRimData(PartType.COMMAND, "$", 0.1),
  ],
}

export default OuterRim
