import React from "react"
import styled from "styled-components"
import SortableTree from "react-sortable-tree"
import "react-sortable-tree/style.css"
import ClassField from "./class-field"
import ParameterField from "./parameter-field"

const Wrapper = styled.div`
  .rst__rowContents {
    background-color: #21232b;
    border-radius: 0.8rem;
    border: 1px solid black;
    z-index: 2;
  }

  height: 100%;
`

class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: [
        {
          title: ({ node }) => (
            <ClassField
              index={0}
              className={"Example"}
              isExpanded={node.expanded}
            />
          ),
          expanded: false,
          children: [
            {
              title: ({ node }) => (
                <ParameterField
                  index={0}
                  paramName={"a"}
                  isExpanded={node.expanded}
                />
              ),
              expanded: false,
              children: [{}],
            },
            {
              title: "Add property",
            },
          ],
        },
      ],
    }
  }

  handleChange = treeData => this.setState({ treeData })

  getNodeKey = ({ node }) =>
    (node.titleInfo &&
      (node.titleInfo.props.className || node.titleInfo.props.paramName)) ||
    "0"

  generateNodeProps = ({ node }) => ({})

  handleNodeVisibilityToggle = ({ node, expanded }) => {
    node.expanded = expanded
    this.forceUpdate()
  }

  getRowHeight = ({ node }) => (node.expanded ? 400 : 62)

  canDragNode = ({ node }) => node.expanded !== undefined && !node.expanded

  render() {
    return (
      <Wrapper>
        <SortableTree
          treeData={this.state.treeData}
          onChange={this.handleChange}
          getNodeKey={this.getNodeKey}
          generateNodeProps={this.generateNodeProps}
          onVisibilityToggle={this.handleNodeVisibilityToggle}
          rowHeight={this.getRowHeight}
          canDrag={this.canDragNode}
        />
      </Wrapper>
    )
  }
}

export default Sidebar
