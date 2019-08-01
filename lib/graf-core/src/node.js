import uuid from "uuid/v4"
import { Point, Position } from "./position"
import {
  createBtDRLink,
  createBtTLink,
  createLtDLTLink,
  createLtDRLink,
  createLtRLink,
  LinkType,
} from "./link"

const getNow = () => {
  return new Date(Date.now())
}

export class NodeResult {
  /**
   * @enum
   * @type {{TABLE: (NodeResult.Presentation|number), NUMBER: (NodeResult.Presentation|number), TEXT: (NodeResult.Presentation|number), LIST: (NodeResult.Presentation|number)}}
   */
  static Presentation = {
    TABLE: "TABLE",
    LIST: "LIST",
    NUMBER: "NUMBER",
    TEXT: "TEXT",
  }

  /**
   * Creates a new NodeResult object
   * @param {Node} node - The node which has produced this result
   * @param {*} result - The result data
   * @param {Date} startTime - The start time of the result producing operation
   * @param {Date} endTime - The end time of the result producing operation
   * @param {string|React.Component|null} presentation - Defines the presentation
   */
  constructor(node, result, startTime, endTime, presentation=null) {
    this.node = node
    this.data = result
    this.startTime = startTime
    this.endTime = endTime
    this.presentation = presentation ||
      NodeResult.getDefaultPresentation(this.data)
  }

  toString() {
    return `${this.node} from ${this.startTime} til ${this.endTime} returned: ${this.data}`
  }

  /**
   * Returns the default presentation option based on the data
   * @param {*} data
   * @return {Presentation}
   */
  static getDefaultPresentation(data) {
    if (Array.isArray(data)) {
      if (data.every(e => Array.isArray(e))) {
        return this.Presentation.TABLE;
      } else {
        return this.Presentation.LIST;
      }
    }

    if (Number(data) === data) {
      return this.Presentation.NUMBER;
    }

    if (String(data) === data) {
      return this.Presentation.TEXT;
    }
  }
}

export class NodeError {
  /**
   * Creates a new NodeResult object
   * @param {Node} node - The node which has produced this result
   * @param {Error|string|object} error - The error data
   * @param {Date} startTime - The time of the error catch
   */
  constructor(node, error, startTime) {
    this.node = node
    this.error = error
    this.startTime = startTime
  }

  toString() {
    return `${this.node} failed at ${this.startTime} with: ${this.error}`
  }
}

export default class Node extends Position {
  static LOG_LEVEL = 0

  /**
   * @field {string} name - The name shown for this node
   * @field {string} id - An unique identifier for this node
   */
  id = uuid()
  name
  width = 100
  height = 50
  onRunning = () => {}
  onFinished = () => {}
  execStep = null
  execFlags = {}
  #isRunning = false
  #operation = null
  #resultHistory = []
  #errorHistory = []
  #prevNode = null
  #nextNodes = []

  /**
   * Creates a new Node
   * @param {string} name - The name shown for this node
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} column - The column used for positioning
   * @param {object} data - Additional data to add to the node
   */
  constructor(name, x, y, column, data = {}) {
    super(x, y, column)
    this.name = name
    for (const [key, value] of this.filterAttributes(data)) {
      this[key] = value
    }
  }

  filterAttributes(attrs, useObjectEntries = true) {
    let entries
    if (useObjectEntries) {
      entries = Object.entries(attrs)
    } else {
      entries = []
      for (const key in attrs) {
        entries.push([key, attrs[key]])
      }
    }

    return entries.filter(([key]) =>
        key !== "name" && key !== "x" && key !== "y" && key !== "column"
    )
  }

  get isRunning() {
    return this.#isRunning
  }

  get operation() {
    return this.#operation
  }

  /**
   * Replaces the current operation
   * @param {Operation} operation
   */
  set operation(operation) {
    if (operation) {
      this.#operation = operation.bind(this)
    }
  }

  /**
   * Returns a copy of the current result history
   * @returns {NodeResult[]}
   */
  get resultHistory() {
    return this.#resultHistory.slice(0)
  }

  /**
   * Returns a copy of the current error history
   * @returns {NodeError[]}
   */
  get errorHistory() {
    return this.#errorHistory.slice(0)
  }

  /**
   * Returns the previous Node
   * @returns {Node|null}
   */
  get previousNode() {
    return this.#prevNode
  }

  /**
   * Returns all nodes following this one
   * @returns {Node[]}
   */
  get nextNodes() {
    return this.#nextNodes.slice(0)
  }

  /**
   * Returns the logical nodes following this one
   * @returns {Node[]}
   */
  get nextLogicalNodes() {
    const nextLogicalNodes = []
    for (const next of this.#nextNodes) {
      if (next.isVisual()) nextLogicalNodes.push(next.nextLogicalNodes)
      else nextLogicalNodes.push(next)
    }
    return nextLogicalNodes.flat()
  }

  /**
   * Returns the node following this one on the right side/next column
   * @return {Node|undefined}
   */
  get nextRightNode() {
    return this.#nextNodes.find(node => node.column > this.column)
  }

  /**
   * Returns the nodes following under this one/in this column
   * @return {Node[]}
   */
  get nextBottomNodes() {
    return this.#nextNodes.filter(node => node.column === this.column)
  }

  /**
   * Returns the nodes following the right side node in its column
   * @return {Node[]|undefined}
   */
  get sequenceNodes() {
    const seqNode = this.nextRightNode
    if (seqNode === undefined) {
      return undefined
    } else {
      let nodes = seqNode.nextBottomNodes
      for (const current of nodes) {
        nodes = nodes.concat(current.nextBottomNodes)
      }
      return nodes
    }
  }

  /**
   * Returns the center of the visual representation of this node
   * @returns {Point}
   */
  get center() {
    return new Point(this.x + this.width / 2, this.y + this.height / 2)
  }

  /**
   * Returns the bottom center of the visual representation of this node
   * @returns {Point}
   */
  get bottomCenter() {
    return new Point(this.x + this.width / 2, this.y + this.height)
  }

  /**
   * Returns the top center of the visual representation of this node
   * @returns {Point}
   */
  get topCenter() {
    return new Point(this.x + this.width / 2, this.y)
  }

  /**
   * Returns the left center of the visual representation of this node
   * @returns {Point}
   */
  get leftCenter() {
    return new Point(this.x, this.y + this.height / 2)
  }

  /**
   * Returns the right center of the visual representation of this node
   * @returns {Point}
   */
  get rightCenter() {
    return new Point(this.x + this.width, this.y + this.height / 2)
  }

  get isRunnable() {
    return this.#operation !== null
  }

  /**
   * Clones this Node and replaces its attributes with the parameter if provided
   * @param {object|undefined} attributes - The attributes to be replaced
   * @returns {Node} The cloned Node with replaced attributes
   */
  clone(attributes) {
    const filteredAttrs = {}
    const filteredAttrsArray = this.filterAttributes(
      // TODO: Copy *all* attributes from this
      Object.assign({}, this, attributes),
      false
    )
    for (const [key, value] of filteredAttrsArray) {
      filteredAttrs[key] = value
    }

    return new Node(
      attributes.name || this.name,
      attributes.x || this.x,
      attributes.y || this.y,
      attributes.column || this.column,
      filteredAttrs
    )
  }

  toString() {
    return `("${this.name}" { id: ${this.id} })`
  }

  run(...args) {
    if (this.#operation !== null) {
      this.#isRunning = true
      this.onRunning()

      let finalResult
      try {
        const startTime = getNow()
        const result = this.#operation.apply(this, args)
        const endTime = getNow()
        const nodeResult = new NodeResult(this, result, startTime, endTime)
        this.#resultHistory.push(nodeResult)
        finalResult = nodeResult
      } catch (e) {
        const catchTime = getNow()
        const error = new NodeError(this, e, catchTime)
        this.#errorHistory.push(error)
        finalResult = error
      } finally {
        this.#isRunning = false
        this.onFinished()
      }
      return finalResult
    }
  }

  runCatching(...args) {
    const result = this.run.apply(this, args)
    if (result.constructor.name === "NodeResult") {
      return result.data
    } else if (result.constructor.name === "NodeError") {
      throw new Error(`${this}: Evaluation failed because of previous error: ${result}`)
    }
  }

  /**
   * Returns true if this node is part of the programming logic
   * @returns {boolean}
   */
  isLogical() {
    return !this.isVisual()
  }

  /**
   * Returns true if this node is a visual supporting node
   * @returns {boolean}
   */
  isVisual() {
    return this.name === "·" || this.name === "#>"
  }

  /**
   * Links this Node with another one
   * @param {Node} nextNode - A Node following this one
   * @param {LinkType|null} linkType - An optional link type; will automatically be chosen otherwise
   * @returns {Link}
   */
  linkWith(nextNode, linkType = null) {
    this.#nextNodes.push(nextNode)
    nextNode.#prevNode = this

    let link = null
    if (
      linkType === LinkType.LEFT_TO_RIGHT ||
      (linkType === null && this.y === nextNode.y)
    ) {
      link = createLtRLink(this, nextNode)
    } else if (
      linkType === LinkType.BOTTOM_TO_TOP ||
      (linkType === null && this.x === nextNode.x)
    ) {
      link = createBtTLink(this, nextNode)
    } else if (linkType === LinkType.BOTTOM_TO_DEEPER_RIGHT) {
      link = createBtDRLink(this, nextNode)
    } else if (linkType === LinkType.LEFT_TO_DEEPER_RIGHT) {
      link = createLtDRLink(this, nextNode)
    } else if (linkType === LinkType.LEFT_TO_DEEPER_LEFT_TOP) {
      link = createLtDLTLink(this, nextNode)
    }
    return link
  }
}

export class SequenceNode extends Node {
  /**
   * Creates a new SequenceNode
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} column - The column used for positioning
   * @param {object} data - Additional data to add to the node
   */
  constructor(x, y, column, data = {}) {
    super("·", x, y, column, Object.assign({ width: 20, height: 20 }, data))
  }

  isVisual() {
    return true
  }
}

export class ReportNode extends Node {
  #returningNode

  /**
   * Creates a new ReportNode
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} column - The column used for positioning
   * @param {Node} returningNode - The node returning results and errors to this node
   */
  constructor(x, y, column, returningNode) {
    super("#>", x, y, column, { width: 50, height: 50 })

    this.#returningNode = returningNode
  }

  run(...args) {
    return this.#returningNode.run.apply(this, args)
  }

  get resultHistory() {
    return this.#returningNode.resultHistory.slice(0)
  }

  get errorHistory() {
    return this.#returningNode.errorHistory.slice(0)
  }

  isVisual() {
    return true
  }
}