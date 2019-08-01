const { default: ASTProcessor } = require("./ast-processor")
const CoffeeScript = require("coffeescript")

const NodeType = {
  IDENTIFIER: "IdentifierLiteral",
  NUMBER: "NumberLiteral",
  STRING: "StringLiteral",
}

let processor

describe("AST processor", () => {
  it("is empty after creation", () => {
    processor = new ASTProcessor()
    expect(processor.nodes).toEqual([])
    expect(processor.links).toEqual([])
  })

  it("resets", () => {
    processor.reset()
    expect(processor.nodes).toEqual([])
    expect(processor.links).toEqual([])
  })

  it("gets correct argument type for node", () => {
    expect(processor.getArgumentType({ name: "->" })).toBe("Function")
    expect(processor.getArgumentType({ name: "[]" })).toBe("Array")
    expect(processor.getArgumentType({ name: "{}" })).toBe("Object")
  })

  describe("given a valid variable declaration", () => {
    it("processes the AST nodes", () => {
      const nodes = CoffeeScript.nodes("x = 0")
      processor.process(nodes)
      expect(processor.nodes).toHaveLength(3)
      expect(processor.nodes[0]).toMatchObject({
        name: "=",
      })
      expect(processor.nodes[1]).toMatchObject({
        name: "0",
        value: 0,
        nodeType: NodeType.NUMBER,
        execStep: 1,
      })
      expect(processor.nodes[2]).toMatchObject({
        name: "x",
        nodeType: NodeType.IDENTIFIER,
      })

      expect(processor.links).toHaveLength(2)
    })
  })

  describe("given a valid call", () => {
    it("processes the AST nodes", () => {
      const nodes = CoffeeScript.nodes("Number('0')")
      processor.process(nodes)
      expect(processor.nodes).toHaveLength(4)
      expect(processor.nodes[0]).toMatchObject({
        name: "()",
      })
      expect(processor.nodes[1]).toMatchObject({
        name: "0",
        value: "0",
        nodeType: NodeType.STRING,
        execStep: 1,
      })
      expect(processor.nodes[2]).toMatchObject({
        name: "Number",
        nodeType: NodeType.IDENTIFIER,
      })

      expect(processor.links).toHaveLength(3)
    })
  })
})
