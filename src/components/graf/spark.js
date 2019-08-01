import React from "react"
import PropTypes from "prop-types"
import posed, { PoseGroup } from "react-pose"
import theme from "../../../config/theme"

const Spark = ({ dx, cx, cy, show, duration = 3000 }) => {
  const InnerCircle = posed.circle({
    exit: { opacity: 0 },
    enter: {
      x: dx,
      opacity: 1,
      transition: {
        duration,
      }
    },
  })

  const OuterCircle = posed.circle({
    exit: { opacity: 0 },
    enter: {
      x: dx,
      r: 14,
      opacity: 0.75,
      transition: {
        duration,
      }
    }
  })

  return (
    <PoseGroup>
      {show && (
          <InnerCircle
            key="spark-inner"
            cx={cx}
            cy={cy}
            r={8}
            fill={theme.colors.dark.board.sparks}
          />
      )}
      {show && (
        <OuterCircle
          key="spark-outer"
          cx={cx}
          cy={cy}
          r={8}
          fill={theme.colors.dark.board.sparks}
        />
      )}
    </PoseGroup>
  )
}

Spark.propTypes = {
  show: PropTypes.bool.isRequired,
  dx: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
}

export default Spark
