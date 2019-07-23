export const nodes = [
  { x: 50, y: 20, name: "A", column: 0 },
  { x: 200, y: 300, name: "B", column: 1 },
  { x: 300, y: 40, name: " C" , column: 1 },
]
export const links = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0] },
]

const graph = {
  nodes,
  links,
}

export default graph
