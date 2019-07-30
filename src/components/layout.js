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

const Layout = ({
  children,
  outerContainerId = "outer-container",
  pageWrapId = "page-wrap",
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
        <Header siteTitle={data.site.siteMetadata.title} />
        <Grid fluid>
          <Row>
            <Col xs={6} md={4} lg={3}>
              <Sidebar />
            </Col>
            <Col xs={6} md={8} lg={9}>
              <main id={pageWrapId}>{children}</main>
            </Col>
          </Row>
        </Grid>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
