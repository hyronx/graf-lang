import { Point } from "./position"

/**
 * @enum
 * @type {{
 * BOTTOM_TO_DEEPER_RIGHT: string,
 * BOTTOM_TO_TOP: string,
 * LEFT_TO_DEEPER_RIGHT: string,
 * LEFT_TO_RIGHT: string
 * }}
 */
export const LinkType = {
  LEFT_TO_RIGHT: "right",
  BOTTOM_TO_TOP: "bottom",
  BOTTOM_TO_DEEPER_RIGHT: "straight-bottom-right",
  LEFT_TO_DEEPER_RIGHT: "bottom-right",
  LEFT_TO_DEEPER_LEFT_TOP: "bottom-left-top",
}

export class Link {
  type
  source
  target
  sourceNode
  targetNode

  /**
   * Constructs a new Link
   * @param {Point} source
   * @param {Point} target
   * @param {LinkType} type
   * @param {Node|null} sourceNode
   * @param {Node|null} targetNode
   */
  constructor(source, target, type, sourceNode = null, targetNode = null) {
    this.source = source
    this.target = target
    this.type = type
    this.sourceNode =
      sourceNode || (source.constructor.name.includes("Node") ? source : null)
    this.targetNode =
      targetNode || (target.constructor.name.includes("Node") ? target : null)
  }

  toJSON() {
    return {
      type: this.type,
      source: new Point(this.source.x, this.source.y),
      target: new Point(this.target.x, this.target.y),
      sourceNode: this.sourceNode.id,
      targetNode: this.targetNode.id,
    }
  }

  static fromJSON({ source, target, type, sourceNode, targetNode }, allNodes) {
    if (typeof sourceNode === "string") {
      sourceNode = allNodes.find(node => node.id === sourceNode)
    }

    if (typeof targetNode === "string") {
      targetNode = allNodes.find(node => node.id === targetNode)
    }

    return new Link(source, target, type, sourceNode, targetNode)
  }
}

/**
 * Creates a new left-to-right Link
 * @param {Node} source
 * @param {Node} target
 * @returns {Link}
 */
export const createLtRLink = (source, target) => {
  const sourcePos = source.clone({
    x: source.x + 100,
    y: source.y + 25,
  })
  const targetPos = target.clone({
    x: target.isVisual() ? target.x + 50 : target.x,
    y: target.y + 25,
  })
  return new Link(sourcePos, targetPos, LinkType.LEFT_TO_RIGHT)
}

/**
 * Creates a new bottom-to-top Link
 * @param {Node} source
 * @param {Node} target
 * @returns {Link}
 */
export const createBtTLink = (source, target) => {
  const sourcePos = source.clone({
    x: source.x + 50,
    y: source.y + 25,
  })
  const targetPos = target.clone({
    x: target.x + 50,
    y: target.y,
  })
  return new Link(sourcePos, targetPos, LinkType.BOTTOM_TO_TOP)
}

/**
 * Creates a new bottom-to-deeper-right Link
 * @param {Node} source
 * @param {Node} target
 * @returns {Link}
 */
export const createBtDRLink = (source, target) => {
  const sourcePos = source.clone({
    x: source.x + 50,
    y: source.isVisual() ? source.y + 25 : source.y + 50,
  })
  const targetPos = target.clone({
    x: target.isVisual() ? target.x + 50 : target.x,
    y: target.y + 25,
  })
  return new Link(sourcePos, targetPos, LinkType.BOTTOM_TO_DEEPER_RIGHT)
}

/**
 * Creates a new left-to-deeper-right Link
 * @param {Node} source
 * @param {Node} target
 * @returns {Link}
 */
export const createLtDRLink = (source, target) => {
  const sourcePos = source.clone({
    x: source.isVisual() ? source.x + 50 : source.x - 20,
    y: source.y + 25,
  })
  const targetPos = target.clone({
    x: target.isVisual() ? target.x + 50 : target.x,
    y: target.y + 25,
  })
  return new Link(sourcePos, targetPos, LinkType.LEFT_TO_DEEPER_RIGHT)
}

/**
 * Creates a new left-to-deeper-left-top Link
 * @param {Node} source
 * @param {Node} target
 * @returns {Link}
 */
export const createLtDLTLink = (source, target) => {
  const sourcePos = source.clone({
    x: source.isVisual() ? source.x + 50 : source.x - 20,
    y: source.y + 25,
  })
  const targetPos = target.clone({
    x: target.isVisual() ? target.x + 50 : target.x,
    y: target.y,
  })
  return new Link(sourcePos, targetPos, LinkType.LEFT_TO_DEEPER_LEFT_TOP)
}
