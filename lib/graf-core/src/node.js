// @flow

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
  constructor(
    node: Node,
    result: any,
    startTime: Date,
    endTime: Date,
    presentation: string | React.Component | null = null
  ) {
    this.node = node
    this.data = result
    this.startTime = startTime
    this.endTime = endTime
    this.presentation =
      presentation || NodeResult.getDefaultPresentation(this.data)
  }

  toString() {
    return `${this.node} from ${this.startTime} til ${this.endTime} returned: ${this.data}`
  }

  toJSON() {
    return {
      node: this.node.id,
      data: this.result,
      startTime: this.startTime,
      endTime: this.endTime,
      presentation: this.presentation,
    }
  }

  /**
   * Returns the default presentation option based on the data
   * @param {*} data
   * @return {Presentation}
   */
  static getDefaultPresentation(data) {
    if (Array.isArray(data)) {
      if (data.every(e => Array.isArray(e))) {
        return this.Presentation.TABLE
      } else {
        return this.Presentation.LIST
      }
    }

    if (Number(data) === data) {
      return this.Presentation.NUMBER
    }

    if (String(data) === data) {
      return this.Presentation.TEXT
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
  constructor(node: Node, error: Error | string | any, startTime: Date) {
    this.node = node
    this.error = error
    this.startTime = startTime
  }

  toString() {
    return `${this.node} failed at ${this.startTime} with: ${this.error}`
  }

  toJSON() {
    return {
      node: this.node.id,
      error: this.error,
      startTime: this.startTime,
    }
  }


}

export class Node extends Position {
  static LOG_LEVEL = 0
  static PROPS_FILTER = [
    "name", "x", "y", "column", "isRunning", "operation",
    "resultHistory", "errorHistory", "prevNode", "nextNodes",
    "returningNode"
  ]

  /**
   * @field {string} name - The name shown for this node
   * @field {string} id - An unique identifier for this node
   */
  id: string
  name: string
  width = 100
  height = 50
  onRunning = () => {}
  onFinished = () => {}
  execStep: ?number = null
  execFlags: { skip?: boolean, append?: boolean } = {}
  #isRunning = false
  #operation: ?Operation
  #resultHistory: NodeResult[]
  #errorHistory: NodeError[]
  #prevNode: ?Node
  #nextNodes: Node[]

  /**
   * Creates a new Node
   * @param {string} name - The name shown for this node
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} column - The column used for positioning
   * @param {object} data - Additional data to add to the node
   */
  constructor(name: string, x: number, y: number, column: number, data = {}) {
    super(x, y, column)
    this.name = name
    this.id = data.id || uuid()
    this.#operation = data.operation || null
    this.#resultHistory = data.resultHistory || []
    this.#errorHistory = data.errorHistory || []
    this.#prevNode = data.prevNode || null
    this.#nextNodes = data.nextNodes || []

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

    return entries.filter(([key]) => !Node.PROPS_FILTER.includes(key))
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

  toJSON() {
    return {
      ...super.toJSON(),
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      execStep: this.execStep,
      execFlags: this.execFlags,
      isRunning: this.#isRunning,
      operation: this.operation,
      resultHistory: this.#resultHistory,
      errorHistory: this.#errorHistory,
      prevNode: this.#prevNode ? this.#prevNode.id : null,
      nextNodes: this.#nextNodes.map(({ id }) => id),
    }
  }

  static fromJSON(props) {
    let node
    if (SequenceNode.isSequenceNode(props))
      node = new SequenceNode(props.x, props.y, props.column, props)
    else if (ReportNode.isReportNode(props))
      node = new ReportNode(props.x, props.y, props.column, props.returningNode, props)
    else
      node = new Node(props.name, props.x, props.y, props.column, props)


    node.onAllNodesMapped = function(allNodes) {
      if (this.#prevNode !== null) {
        const prevNode = allNodes.find(({ id }) => id === this.#prevNode)
        if (!prevNode) throw new Error(
          `No previous node found for id: ${this.#prevNode}`
        )
        this.#prevNode = prevNode
      }

      this.#nextNodes = this.#nextNodes.map(nextNodeId => {
        const nextNode = allNodes.find(({ id }) => id === nextNodeId)
        if (!nextNode) throw new Error(`No next node found for id: ${nextNodeId}`)
        else return nextNode
      })

      if (this instanceof ReportNode) {
        const returningNode = allNodes.find(({ id }) => id === props.returningNode)
        if (!returningNode) throw new Error(
          `No returning node found for id: ${props.returningNode}`
        )
        this.returningNode = returningNode
      }
    }
    return node
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
      throw new Error(
        `${this}: Evaluation failed because of previous error: ${result}`
      )
    }
  }

  /**
   * Returns true if this node is part of the programming logic
   * @returns {boolean}
   */
  isLogical() {
    return !this.isVisual() && !this.isInternal()
  }

  /**
   * Returns true if this node is a visual supporting node
   * @returns {boolean}
   */
  isVisual() {
    return this.name === "·" || this.name === "#>"
  }

  /**
   * Returns true if this node is an internal, usually hidden node
   * @returns {boolean}
   */
  isInternal() {
    return this.name.startsWith("___") && this.name.endsWith("___")
  }

  /**
   * Returns true if this node is the internal hidden root node
   * @returns {boolean}
   */
  isRoot() {
    return this.isInternal() && this.name.includes("ROOT")
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

export default Node

export class SequenceNode extends Node {
  static ID = "·"
  /**
   * Creates a new SequenceNode
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} column - The column used for positioning
   * @param {object} data - Additional data to add to the node
   */
  constructor(x, y, column, data = {}) {
    super(SequenceNode.ID, x, y, column, { width: 20, height: 20, ...data })
  }

  isVisual() {
    return true
  }

  static isSequenceNode(props) {
    return props.name === SequenceNode.ID
  }

  toJSON() {
    return super.toJSON()
  }
}

export class ReportNode extends Node {
  static ID = "#>"
  #returningNode

  /**
   * Creates a new ReportNode
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} column - The column used for positioning
   * @param {Node} returningNode - The node returning results and errors to this node
   * @param {object} data - Additional data to add to the node
   */
  constructor(x, y, column, returningNode, data) {
    super(ReportNode.ID, x, y, column, { width: 50, height: 50, ...data })

    this.#returningNode = returningNode
  }

  get returningNode() {
    return this.#returningNode
  }

  set returningNode(value) {
    if (this.#returningNode !== null)
      this.#returningNode = value
    else
      throw new Error("The returning node cannot be changed")
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

  static isReportNode(props) {
    return props.name === ReportNode.ID
  }

  toJSON() {
    return {
      ...super.toJSON(),
      returningNode: this.returningNode.id,
    }
  }
}

export const RootNode = new Node("___ROOT___", 30, -100, 0)
