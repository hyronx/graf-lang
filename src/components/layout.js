/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import { Grid, Row, Col } from "react-flexbox-grid"
import "../assets/css/main.css"
import Header from "./header"
import Sidebar from "./sidebar"
import { getTypes } from "../state"

const Layout = ({
  children,
  outerContainerId,
  pageWrapId,
  treeData,
  modals,
  onAddElement,
  onElementAdded,
  onElementSelected,
  onElementDeselected,
}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <div
        id={outerContainerId}
        style={{
          margin: "0 auto",
          maxWidth: 1920,
          padding: "0 1.0875rem 1.45rem 0",
        }}
      >
        <Header
          id="header"
          siteTitle={data.site.siteMetadata.title}
          onAddElement={onAddElement}
        />
        <Grid fluid>
          <Row>
            <Col xs={6} md={4} lg={4}>
              <Sidebar
                elements={getTypes()}
                selectable={true}
                onAddElement={onAddElement}
                onElementAdded={onElementAdded}
                onSelect={onElementSelected}
                onDeselect={onElementDeselected}
              />
            </Col>
            <Col xs={6} md={8} lg={8}>
              <main id={pageWrapId}>{children}</main>
            </Col>
          </Row>
        </Grid>
        {modals}
        <footer id="footer">
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )}
  />
)

Layout.propTypes = {
  outerContainerId: PropTypes.string.isRequired,
  pageWrapId: PropTypes.string.isRequired,
  treeData: PropTypes.array.isRequired,
  onAddElement: PropTypes.func,
  onElementAdded: PropTypes.func,
  onElementSelected: PropTypes.func,
  onElementDeselected: PropTypes.func,
  modals: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  children: PropTypes.node.isRequired,
}

Layout.defaultProps = {
  outerContainerId: "outer-container",
  pageWrapId: "main",
  modals: [],
  onAddElement: type => console.log(`Add new ${type}`),
  onElementAdded: node => console.log(`Added new ${node}`),
}

export default Layout
