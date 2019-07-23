Array.prototype.last = function() {
  return this[this.length - 1]
}

class NodeWalker {
  static SKIP = 0
  static DROP = 1

  current
  #nodesToWalkQueue = []
  #resultStack = []

  /**
   * Creates a new NodeWalker
   * @param {Node} root
   * @param {{
   *  onWillRun: function|undefined,
   *  onHasRun: function|undefined
   * }} options
   */
  constructor(root, options={}) {
    this.current = root
    this.#nodesToWalkQueue.push(this.current)

    if (options.onWillRun) this.onWillRun = options.onWillRun
    if (options.onHasRun) this.onHasRun = options.onHasRun
  }

  async onWillRun(args) {}

  async onHasRun(args, result) {}

  prependNextNodes() {
    const current = this.current
    let nodes = current.nextNodes.slice(0).reverse()
    for (const node of nodes) {
      this.current = node
      this.prependNextNodes()
    }

    this.#nodesToWalkQueue = nodes.concat(this.#nodesToWalkQueue)
    this.current = current
  }

  async execute() {
    while ((this.current = this.#nodesToWalkQueue.shift()) !== undefined) {
      if (this.current.isVisual()) {
        this.prependNextNodes()
      } else if (!this.current.isRunnable) {
        this.#nodesToWalkQueue.splice(-1, 0, ...this.current.nextNodes)
      } else {
        const { args: opArgs, hasVarArg } = this.current.operation
        let args
        if (opArgs.length > 0)
          args = opArgs.map(() => this.#resultStack.pop())
        else if (hasVarArg)
          // TODO: Definitely wrong
          args = this.#resultStack.pop()

        let cbRes = await this.onWillRun(args)
        if (Array.isArray(cbRes)) args = cbRes
        else if (cbRes === NodeWalker.SKIP) continue

        let result
        if (Array.isArray(args)) {
          args = (await Promise.all(args))
            .filter(a => a !== undefined)
            .map(a => a.data)

          result = await this.current.run.apply(args)
        } else {
          result = await this.current.run()
        }
        result = Array.isArray(result) ? result : [result]
        this.#resultStack.push(result)

        cbRes = await this.onHasRun(args, result)
        if (Array.isArray(cbRes)) result = cbRes
        else if (cbRes === NodeWalker.SKIP) continue

        this.#nodesToWalkQueue.splice(-1, 0, ...this.current.nextNodes)
      }
    }
  }
}

const resultStack = []

/**
 * Executes all nodes following the root
 *
 * This is a recursive implementation which isn't optimized and should be seen
 * as a proof-of-concept, not more.
 *
 * @param {Node} root
 * @param {{
 *  onWillRun: function|undefined,
 *  onHasRun: function|undefined
 * }} options
 */
export const executeNodesAsync = async (root, options={}) => {
  const walker = new NodeWalker(root, options)
  return walker.execute()
}
/*
export const executeNodesAsync = async (root, options={}) => {
  const nextResults = root.nextNodes
    .map(async next => await executeNodesAsync(next, options))

  let args = resultStack.pop()
  if (options.onWillRun) {
    const cbRes = await options.onWillRun(root, args)
    if (Array.isArray(cbRes)) args = cbRes
  }
  let result = await (Array.isArray(args)
    ? root.run(...(await Promise.all(args))
        .filter(a => a !== undefined)
        .map(a => a.data)
      )
    : root.run()
  )
  if (options.onHasRun) {
    const cbRes = await options.onHasRun(root, args, result)
    if (Array.isArray(cbRes)) result = cbRes
  }

  resultStack.push(nextResults.length > 0
    ? nextResults
    : [result]
  )
}
 */

/**
 *
 * @param {Node} root
 * @param {function} callback
 * @param {{
 *  onWillRun: function|undefined,
 *  onHasRun: function|undefined
 * }} options
 */
export const executeNodes = (root, callback, options={}) => {
  executeNodesAsync(root, options).then(
    callback,
      e => callback(undefined, e)
  )
}

export default executeNodesAsync
