import PropTypes from "prop-types"
import React from "react"
import { createGlobalStyle } from "styled-components"
import theme from "../../config/theme"

const GlobalMenuStyle = createGlobalStyle`
  .${props => props.prefixClass} {
    outline: none;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    border: 1px solid ${props => props.theme.default.background};
    box-shadow: 0 0 4px ${props => props.theme.default.background};
    border-radius: 3px;
    color: ${props => props.theme.text.default};
  }
  .${props => props.prefixClass}-hidden {
    display: none;
  }
  .${props => props.prefixClass}-collapse {
    overflow: hidden;
  }
  .${props => props.prefixClass}-collapse-active {
    transition: height 0.3s ease-out;
  }
  .${props => props.prefixClass}-item-group-list {
    margin: 0;
    padding: 0;
  }
  .${props => props.prefixClass}-item-group-title {
    color: ${props => props.theme.text.default};
    line-height: 1.5;
    padding: 8px 10px;
    border-bottom: 1px solid #dedede;
  }
  .${props => props.prefixClass}-item-active,
    .${props => props.prefixClass}-submenu-active
    > .${props => props.prefixClass}-submenu-title {
    background-color: ${props => props.theme.default.active};
  }
  .${props => props.prefixClass}-item-selected {
    background-color: #eaf8fe;
    transform: translateZ(0);
  }
  .${props => props.prefixClass}-submenu-selected {
    background-color: #eaf8fe;
  }
  .${props => props.prefixClass} > li.${props => props.prefixClass}-submenu {
    padding: 0;
  }
  .${props => props.prefixClass}-horizontal.${props => props.prefixClass}-sub,
    .${props => props.prefixClass}-vertical.${props => props.prefixClass}-sub,
    .${props => props.prefixClass}-vertical-left.${props =>
  props.prefixClass}-sub,
    .${props => props.prefixClass}-vertical-right.${props =>
  props.prefixClass}-sub {
    min-width: 160px;
    margin-top: 0;
  }
  .${props => props.prefixClass}-item, .${props =>
  props.prefixClass}-submenu-title {
    margin: 0;
    position: relative;
    display: block;
    padding: 7px 7px 7px 16px;
    white-space: nowrap;
  }
  .${props => props.prefixClass}-item.${props =>
  props.prefixClass}-item-disabled,
    .${props => props.prefixClass}-submenu-title.${props =>
  props.prefixClass}-item-disabled,
    .${props => props.prefixClass}-item.${props =>
  props.prefixClass}-submenu-disabled,
    .${props => props.prefixClass}-submenu-title.${props =>
  props.prefixClass}-submenu-disabled {
    color: #777 !important;
  }
  .${props => props.prefixClass} > .${props => props.prefixClass}-item-divider {
    height: 1px;
    margin: 1px 0;
    overflow: hidden;
    padding: 0;
    line-height: 0;
    background-color: #e5e5e5;
  }
  .${props => props.prefixClass}-submenu-popup {
    position: absolute;
  }
  .${props => props.prefixClass}-submenu-popup .submenu-title-wrapper {
    padding-right: 20px;
  }
  .${props => props.prefixClass}-submenu > .${props => props.prefixClass} {
    background-color: ${props => props.theme.default.background};
  }
  .${props => props.prefixClass} .${props =>
  props.prefixClass}-submenu-title .anticon,
  .${props => props.prefixClass} .${props => props.prefixClass}-item .anticon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    top: -1px;
  }
  .${props => props.prefixClass}-horizontal {
    background-color: ${props => props.theme.default.background};
    border: none;
    border-bottom: 1px solid ${props => props.theme.default.background};
    box-shadow: none;
    white-space: nowrap;
    overflow: hidden;
  }
  .${props => props.prefixClass}-horizontal
    > .${props => props.prefixClass}-item,
    .${props => props.prefixClass}-horizontal
    > .${props => props.prefixClass}-submenu
    > .${props => props.prefixClass}-submenu-title {
    padding: 15px 20px;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    line-height: 1.5;
    font-weight: 300;
  }
  .${props => props.prefixClass}-horizontal
    > .${props => props.prefixClass}-submenu,
    .${props => props.prefixClass}-horizontal
    > .${props => props.prefixClass}-item {
    border-bottom: 2px solid transparent;
    display: inline-block;
    vertical-align: bottom;
  }
  .${props => props.prefixClass}-horizontal
    > .${props => props.prefixClass}-submenu-active,
    .${props => props.prefixClass}-horizontal
    > .${props => props.prefixClass}-item-active {
    border-bottom: 2px solid ${props => props.theme.default.paper};
    background-color: ${props => props.theme.default.background};
    color: ${props => props.theme.text.default};
  }
  .${props => props.prefixClass}-horizontal:after {
    content: "\20";
    display: block;
    height: 0;
    clear: both;
  }
  .${props => props.prefixClass}-vertical,
    .${props => props.prefixClass}-vertical-left,
    .${props => props.prefixClass}-vertical-right,
    .${props => props.prefixClass}-inline {
    padding: 12px 0;
  }
  .${props => props.prefixClass}-vertical
    > .${props => props.prefixClass}-item,
    .${props => props.prefixClass}-vertical-left
    > .${props => props.prefixClass}-item,
    .${props => props.prefixClass}-vertical-right
    > .${props => props.prefixClass}-item,
    .${props => props.prefixClass}-inline
    > .${props => props.prefixClass}-item,
    .${props => props.prefixClass}-vertical
    > .${props => props.prefixClass}-submenu
    > .${props => props.prefixClass}-submenu-title,
    .${props => props.prefixClass}-vertical-left
    > .${props => props.prefixClass}-submenu
    > .${props => props.prefixClass}-submenu-title,
    .${props => props.prefixClass}-vertical-right
    > .${props => props.prefixClass}-submenu
    > .${props => props.prefixClass}-submenu-title,
    .${props => props.prefixClass}-inline
    > .${props => props.prefixClass}-submenu
    > .${props => props.prefixClass}-submenu-title {
    padding: 12px 8px 12px 24px;
  }
  .${props => props.prefixClass}-vertical
    .${props => props.prefixClass}-submenu-arrow,
    .${props => props.prefixClass}-vertical-left
    .${props => props.prefixClass}-submenu-arrow,
    .${props => props.prefixClass}-vertical-right
    .${props => props.prefixClass}-submenu-arrow,
    .${props => props.prefixClass}-inline
    .${props => props.prefixClass}-submenu-arrow {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    vertical-align: baseline;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
    position: absolute;
    right: 16px;
    line-height: 1.5em;
  }
  .${props => props.prefixClass}-vertical
    .${props => props.prefixClass}-submenu-arrow:before,
    .${props => props.prefixClass}-vertical-left
    .${props => props.prefixClass}-submenu-arrow:before,
    .${props => props.prefixClass}-vertical-right
    .${props => props.prefixClass}-submenu-arrow:before,
    .${props => props.prefixClass}-inline
    .${props => props.prefixClass}-submenu-arrow:before {
    content: "\f0da";
  }
  .${props => props.prefixClass}-inline .${props =>
  props.prefixClass}-submenu-arrow {
    transform: rotate(90deg);
    transition: transform 0.3s;
  }
  .${props => props.prefixClass}-inline
    .${props => props.prefixClass}-submenu-open
    > .${props => props.prefixClass}-submenu-title
    .${props => props.prefixClass}-submenu-arrow {
    transform: rotate(-90deg);
  }
  .${props => props.prefixClass}-vertical.${props => props.prefixClass}-sub,
    .${props => props.prefixClass}-vertical-left.${props =>
  props.prefixClass}-sub,
    .${props => props.prefixClass}-vertical-right.${props =>
  props.prefixClass}-sub {
    padding: 0;
  }
  .${props => props.prefixClass}-sub.${props => props.prefixClass}-inline {
    padding: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
  .${props => props.prefixClass}-sub.${props => props.prefixClass}-inline
    > .${props => props.prefixClass}-item,
    .${props => props.prefixClass}-sub.${props => props.prefixClass}-inline
    > .${props => props.prefixClass}-submenu
    > .${props => props.prefixClass}-submenu-title {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 0;
  }
  .${props => props.prefixClass}-open-slide-up-enter,
    .${props => props.prefixClass}-open-slide-up-appear {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    transform-origin: 0 0;
    opacity: 0;
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-play-state: paused;
  }
  .${props => props.prefixClass}-open-slide-up-leave {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    transform-origin: 0 0;
    opacity: 1;
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-play-state: paused;
  }
  .${props => props.prefixClass}-open-slide-up-enter.${props =>
  props.prefixClass}-open-slide-up-enter-active,
    .${props => props.prefixClass}-open-slide-up-appear.${props =>
  props.prefixClass}-open-slide-up-appear-active {
    animation-name: rcMenuOpenSlideUpIn;
    animation-play-state: running;
  }
  .${props => props.prefixClass}-open-slide-up-leave.${props =>
  props.prefixClass}-open-slide-up-leave-active {
    animation-name: rcMenuOpenSlideUpOut;
    animation-play-state: running;
  }
  @keyframes rcMenuOpenSlideUpIn {
    0% {
      opacity: 0;
      transform-origin: 0% 0%;
      transform: scaleY(0);
    }
    100% {
      opacity: 1;
      transform-origin: 0% 0%;
      transform: scaleY(1);
    }
  }
  @keyframes rcMenuOpenSlideUpOut {
    0% {
      opacity: 1;
      transform-origin: 0% 0%;
      transform: scaleY(1);
    }
    100% {
      opacity: 0;
      transform-origin: 0% 0%;
      transform: scaleY(0);
    }
  }
  .${props => props.prefixClass}-open-zoom-enter, .${props =>
  props.prefixClass}-open-zoom-appear {
    opacity: 0;
    animation-duration: 0.3s;
    animation-fill-mode: both;
    transform-origin: 0 0;
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-play-state: paused;
  }
  .${props => props.prefixClass}-open-zoom-leave {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    transform-origin: 0 0;
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-play-state: paused;
  }
  .${props => props.prefixClass}-open-zoom-enter.${props =>
  props.prefixClass}-open-zoom-enter-active,
    .${props => props.prefixClass}-open-zoom-appear.${props =>
  props.prefixClass}-open-zoom-appear-active {
    animation-name: rcMenuOpenZoomIn;
    animation-play-state: running;
  }
  .${props => props.prefixClass}-open-zoom-leave.${props =>
  props.prefixClass}-open-zoom-leave-active {
    animation-name: rcMenuOpenZoomOut;
    animation-play-state: running;
  }
  @keyframes rcMenuOpenZoomIn {
    0% {
      opacity: 0;
      transform: scale(0, 0);
    }
    100% {
      opacity: 1;
      transform: scale(1, 1);
    }
  }
  @keyframes rcMenuOpenZoomOut {
    0% {
      transform: scale(1, 1);
    }
    100% {
      opacity: 0;
      transform: scale(0, 0);
    }
  }
`

GlobalMenuStyle.propTypes = {
  prefixClass: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    default: {
      paper: PropTypes.string.isRequired,
      background: PropTypes.string.isRequired,
      hover: PropTypes.string.isRequired,
      active: PropTypes.string.isRequired,
    },
    text: {
      default: PropTypes.string.isRequired,
      primary: PropTypes.string.isRequired,
    },
  }).isRequired,
}

GlobalMenuStyle.defaultProps = {
  theme: theme.colors.dark,
}

export default GlobalMenuStyle
