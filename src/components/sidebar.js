import React from "react"
import styled from "styled-components"
import { push as Menu } from "react-burger-menu"
import ClassField from "./class-field"
import { Argument } from "../services/operation"
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const Wrapper = styled.div`
  /* Individual item */
  .bm-item {
    display: inline-block;

    /* Our sidebar item styling */
    text-decoration: none;
    margin-bottom: 10px;
    color: #d1d1d1;
    transition: color 0.2s;
  }

  /* Change color on hover */
  .bm-item:hover {
    color: white;
  }
  
  .bm-menu-wrap {
    bottom: 0;
    left: 0;
  }

  /* The rest copied directly from react-burger-menu docs */

  /* Position and sizing of burger button */
  .bm-burger-button {
    position: absolute;
    width: 36px;
    height: 30px;
    left: 36px;
    top: 36px;
  }

  /* Color/shape of burger icon bars */
  .bm-burger-bars {
    background: #373a47;
  }

  /* Position and sizing of clickable cross button */
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: #bdc3c7;
  }

  /* General sidebar styles */
  .bm-menu {
    background: #373a47;
    padding: 2.5em 1.5em 0;
    font-size: 1.15em;
  }

  /* Morph shape necessary with bubble or elastic */
  .bm-morph-shape {
    fill: #373a47;
  }

  /* Wrapper for item list */
  .bm-item-list {
    color: #b8b7ad;
  }

  /* Styling of overlay */
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
  
  #sidebar-menu {
    background-color: #F5F5F5;
    float: left;
    height: 300px;
    margin-bottom: 25px;
    margin-left: 22px;
    margin-top: 40px;
    width: 65px;
    overflow-y: scroll;
  }
  
  #sidebar-menu::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
  }
  
  #sidebar-menu::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #D62929;
  }

  #sidebar-menu::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }
`

class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = Object.assign({}, this.props)
  }

  render() {
    const { children } = this.props
    return (
      <Wrapper>
        <SimpleBar>
          <Menu {...this.state}>
            <ClassField
              index={0}
              className="Example"
              classProps={[new Argument("a", "number", "Example")]}
            />
            <ClassField
              index={1}
              className="Example1"
              classProps={[new Argument("a", "number", "Example")]}
            />
          </Menu>
        </SimpleBar>
      </Wrapper>
    )
  }
}

export default Sidebar
