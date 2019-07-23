import React from "react"
import PropTypes from "prop-types"

/*
              <rect
                className={`symbol-${node.name}`}
                x={dx + 50}
                y={dy}
                height={50}
                width={50}
                transform={`rotate(45, ${dx + 50}, ${dy})`}
                rx={5}
                stroke={isDragging ? "white" : "transparent"}
                strokeWidth={2}
                style={{ fill: "diamond" }}
              />
            */
/*
            <g transform={`translate(${dx}, ${dy}) scale(0.5, 0.5)`}>
                <g fill="none" style={{"mix-blend-mode": "normal"}}>
                  <path d="M0,172v-172h172v172z" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10"/>
                  <g>
                    <path d="M116.1,12.9l-4.3,-4.3l-51.1442,-1.7458l-6.3339,7.1122l-7.5938,52.1547l40.5189,97.567l37.0789,-94.4667z" fill="#b6dcfe" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10">
                    </path>
                    <path d="M55.9,8.6l-38.7,55.9l68.8,98.9l-38.3689,-94.9053z" fill="#98ccfd" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10">
                    </path>
                    <path d="M116.1,8.6l41.5122,54.0553l-69.4622,99.2096l37.496,-95.0644z" fill="#dff0fe" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                    <path d="M125.775,65.575l-11.825,-59.125" fill="none" stroke="#4788c7" strokeLinejoin="miter" strokeMiterlimit="2" />
                    <path d="M115.971,8.6l37.8959,55.8484l-67.8669,95.8126l-67.8669,-95.8126l37.8959,-55.8484h59.942M118.25,4.3h-64.5l-40.85,60.2l73.1,103.2l73.1,-103.2l-40.85,-60.2z" fill="#4788c7" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                    <path d="M45.15,66.65l38.7,94.6M126.85,66.65l-38.7,94.6M154.8,66.65h-137.6" fill="none" stroke="#4788c7" strokeLinejoin="miter" strokeMiterlimit="2" />
                    <path d="M44.7372,65.575l43.4128,-59.125l37.625,59.125" fill="none" stroke="#4788c7" strokeLinejoin="bevel" strokeMiterlimit="2" />
                    <path d="M58.05,6.45l-13.3128,59.125" fill="none" stroke="#4788c7" strokeLinejoin="miter" strokeMiterlimit="2" />
                  </g>
                  <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                  <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                  <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                  <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                  <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
                </g>
              </g>
            */

const ReportNode = ({ x, y }) => (
  /* Symbol from https://icons8.com/icons/set/diamond */
  <g transform={`translate(${x}, ${y}) scale(0.5, 0.5)`}>
    <g fill="none" style={{ mixBlendMode: "normal" }}>
      <path d="M0,172v-172h172v172z" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10"/>
      <g>
        <path d="M116.1,12.9l-4.3,-4.3l-51.1442,-1.7458l-6.3339,7.1122l-7.5938,52.1547l40.5189,97.567l37.0789,-94.4667z" fill="#000000" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10">
        </path>
        <path d="M55.9,8.6l-38.7,55.9l68.8,98.9l-38.3689,-94.9053z" fill="#34495e" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10">
        </path>
        <path d="M116.1,8.6l41.5122,54.0553l-69.4622,99.2096l37.496,-95.0644z" fill="#666666" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
        <path d="M125.775,65.575l-11.825,-59.125" fill="none" stroke="#4788c7" strokeLinejoin="miter" strokeMiterlimit="2" />
        <path d="M115.971,8.6l37.8959,55.8484l-67.8669,95.8126l-67.8669,-95.8126l37.8959,-55.8484h59.942M118.25,4.3h-64.5l-40.85,60.2l73.1,103.2l73.1,-103.2l-40.85,-60.2z" fill="#f1c40f" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
        <path d="M45.15,66.65l38.7,94.6M126.85,66.65l-38.7,94.6M154.8,66.65h-137.6" fill="none" stroke="#f1c40f" strokeLinejoin="miter" strokeMiterlimit="2" />
        <path d="M44.7372,65.575l43.4128,-59.125l37.625,59.125" fill="none" stroke="#f1c40f" strokeLinejoin="bevel" strokeMiterlimit="2" />
        <path d="M58.05,6.45l-13.3128,59.125" fill="none" stroke="#f1c40f" strokeLinejoin="miter" strokeMiterlimit="2" />
      </g>
      <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
      <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
      <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
      <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
      <path d="" fill="none" stroke="none" strokeLinejoin="miter" strokeMiterlimit="10" />
    </g>
  </g>
)

ReportNode.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
}

export default ReportNode
