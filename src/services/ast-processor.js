import { max } from "d3-array"
import Node, { ReportNode, SequenceNode } from "./node"
import {
  createLtRLink,
  createLtDRLink,
  createBtTLink,
  createBtDRLink,
  createLtDLTLink,
  LinkType,
} from "./link"
import Operation, { Argument, Result } from "./operation"

class ASTProcessor {
  constructor(props = { yMargin: 100 }) {
    this.nodes = []
    this.links = []
    this.yMargin = props.yMargin
  }

  reset() {
    this.nodes = []
    this.links = []
  }

  getNextNodeYPosition() {
    return max(this.nodes.map(n => n.y)) + this.yMargin
  }

  getNodeXPosition(basePosition, dX) {
    return basePosition.x % 100 === 70
      ? basePosition.x + (dX - 70)
      : basePosition.x + dX
  }

  createElementNodes(baseNode, elementsKey, baseGrafNode) {
    const elementNodes = baseNode[elementsKey].map((element, index) =>
      this.process(element, {
        x: this.getNodeXPosition(baseGrafNode, 320),
        y: baseGrafNode.y + this.yMargin * (index + 1),
        column: baseGrafNode.column + 1,
      })
    )

    elementNodes.forEach((element, index, self) => {
      this.nodes.push(element)

      if (index > 0) {
        this.links.push(
          self[index - 1].linkWith(element, LinkType.LEFT_TO_DEEPER_RIGHT)
        )
      }
    })

    const elementNode = new SequenceNode(
      this.getNodeXPosition(baseGrafNode, 250),
      baseGrafNode.y,
      baseGrafNode.column + 1
    )
    this.nodes.push(elementNode)
    this.links.push(
      baseGrafNode.linkWith(elementNode, LinkType.LEFT_TO_RIGHT),
      elementNode.linkWith(elementNodes[0], LinkType.LEFT_TO_DEEPER_RIGHT)
    )

    return baseGrafNode
  }

  processValue(astNode, position) {
    const valueBaseNode = this.process(astNode.base, position)

    if (astNode.properties.length > 0) {
      const propNodes = astNode.properties.map(prop =>
        this.process(prop, {
          x: this.getNodeXPosition(position, 70),
          y: this.getNextNodeYPosition(),
          column: position.column,
        })
      )

      propNodes.forEach((prop, index, self) => {
        this.nodes.push(prop)

        const reportNode = new ReportNode(
          position.x,
          this.getNextNodeYPosition(),
          position.column,
          prop
        )
        this.nodes.push(reportNode)
        this.links.push(
          prop.linkWith(reportNode, LinkType.LEFT_TO_DEEPER_LEFT_TOP)
        )

        if (index > 0) {
          this.links.push(
            self[index - 1].linkWith(prop, LinkType.LEFT_TO_DEEPER_RIGHT)
          )
        }
      })

      this.links.push(
        valueBaseNode.linkWith(propNodes[0], LinkType.BOTTOM_TO_DEEPER_RIGHT)
      )
    }

    return valueBaseNode
  }

  processCall(astNode, position) {
    const callVarNode = this.process(astNode.variable, position)
    let lastPropOfCallVarNode
    if (astNode.variable.properties.length > 0) {
      const sortedNodes = Array.from(this.nodes)
        .filter(n => n.isLogical() && n.column === callVarNode.column)
        .sort((a, b) => a.y - b.y)
      // TODO: Not the actual last prop node
      lastPropOfCallVarNode = sortedNodes[sortedNodes.length - 1]
    }

    const callNode = this.createElementNodes(
      astNode,
      "args",
      new Node(
        "()",
        this.getNodeXPosition(position, 300),
        (lastPropOfCallVarNode && lastPropOfCallVarNode.y) || callVarNode.y,
        position.column + 1
      )
    )
    this.nodes.push(callNode)
    this.links.push(
      lastPropOfCallVarNode !== undefined
        ? lastPropOfCallVarNode.linkWith(callNode, LinkType.LEFT_TO_RIGHT)
        : callVarNode.linkWith(callNode, LinkType.LEFT_TO_DEEPER_RIGHT)
    )

    lastPropOfCallVarNode.operation = new Operation(
      async function(thisArg, ...args) {
        return thisArg[lastPropOfCallVarNode.value].apply(thisArg, args)
      },
      {
        result: new Result("Object"),
        args: astNode.args.map(
          a => new Argument(a.value || String(a), "Object")
        ),
      }
    )
    return callVarNode
  }

  processBlock(astNode, position) {
    const blockNodes = astNode.expressions.map((expression, index) =>
      this.process(expression, {
        x: position.x,
        y: position.y + this.yMargin * index,
        column: position.column,
      })
    )

    blockNodes.forEach((element, index, self) => {
      this.nodes.push(element)

      if (index > 0) {
        this.links.push(
          self[index - 1].linkWith(element, LinkType.LEFT_TO_DEEPER_RIGHT)
        )
      }
    })

    return blockNodes[0]
  }

  processAssign(astNode, position) {
    const variableNameNode = this.process(astNode.variable, {
      x: 100,
      y: 100,
      column: 0,
    })
    const equalsSignNode = new Node("=", 400, 100, 1)
    const valueNode = this.process(astNode.value, {
      x: 700,
      y: 100,
      column: 2,
    })

    this.nodes.push(equalsSignNode, valueNode)
    this.links.push(
      variableNameNode.linkWith(equalsSignNode, LinkType.LEFT_TO_RIGHT),
      equalsSignNode.linkWith(valueNode, LinkType.LEFT_TO_RIGHT)
    )

    /*
    variableNameNode.operation = new Operation(
      function(...args) {
        return valueNode.runCatching.apply(args.shift(), args)
      }, {
        result: valueNode.operation.result,
        args: valueNode.operation.args,
      }
    )
     */
    return variableNameNode
  }

  processCode(astNode, position) {
    const paramNode = this.createElementNodes(
      astNode,
      "params",
      new Node("->", position.x, position.y, position.column)
    )
    const bodyNode = this.process(astNode.body, {
      x: position.x,
      y: this.getNextNodeYPosition(),
      column: position.column,
    })
    this.links.push(paramNode.linkWith(bodyNode, LinkType.BOTTOM_TO_TOP))

    paramNode.operation = new Operation(
      function() {
        return async (...args) => bodyNode.runCatching(...args)
      },
      {
        result: new Result("Function"),
      }
    )
    return paramNode
  }

  processOperation(astNode, position) {
    const opAstNode = Object.assign(
      {
        args: [astNode.first, astNode.second],
      },
      astNode
    )
    return this.createElementNodes(
      opAstNode,
      "args",
      new Node(opAstNode.operator, position.x, position.y, position.column, {
        operation: new Operation(
          async function(first, second) {
            return eval(`${first}${opAstNode.operator}${second}`)
          },
          {
            result: new Result("Object"),
            args: [
              new Argument("first", "Object"),
              new Argument("second", "Object"),
            ],
            isAsync: true,
          }
        ),
      })
    )
  }

  processArray(astNode, position) {
    return this.createElementNodes(
      astNode,
      "objects",
      new Node("[]", position.x, position.y, position.column, {
        operation: new Operation(
          function(...args) {
            return args
          },
          {
            result: new Result("Array", "value"),
            hasVarArg: true,
          }
        ),
        append: true,
        count: true,
      })
    )
  }

  process(astNode, position = { x: 100, y: 100, column: 0 }) {
    const astNodeType = astNode.constructor.name
    switch (astNodeType) {
      case "Block":
        return this.processBlock(astNode, position)
      case "Assign":
        return this.processAssign(astNode, position)
      case "Value":
        return this.processValue(astNode, position)
      case "IdentifierLiteral":
        return new Node(
          astNode.value,
          position.x,
          position.y,
          position.column,
          {
            nodeType: astNodeType,
          }
        )
      case "NumberLiteral":
        return new Node(
          astNode.value,
          position.x,
          position.y,
          position.column,
          {
            nodeType: astNodeType,
            value: astNode.value,
            operation: new Operation(
              function() {
                return this.value
              },
              {
                result: new Result("Number", "value"),
              }
            ),
          }
        )
      case "Arr":
        return this.processArray(astNode, position)
      case "Call":
        return this.processCall(astNode, position)
      case "Access":
        return new Node(
          astNode.name.value,
          position.x,
          position.y,
          position.column,
          {
            value: astNode.name.value,
            operation: new Operation(
              function() {
                return this.value
              },
              {
                result: new Result("Object", astNode.name.value),
              }
            ),
          }
        )
      case "Code":
        return this.processCode(astNode, position)
      case "Op":
        return this.processOperation(astNode, position)
      case "Param":
        return this.process(astNode.name, position)
      default:
        return undefined
    }
  }
}

export default ASTProcessor
