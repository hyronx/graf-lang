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
  constructor(root, options = {}) {
    this.current = root
    this.#nodesToWalkQueue.push(this.current)

    if (options.onWillRun) this.onWillRun = options.onWillRun
    if (options.onHasRun) this.onHasRun = options.onHasRun
  }

  async onWillRun(args) {}

  async onHasRun(args, result) {}

  /**
   * Prepends all following nodes of the current one
   * @return {number} Returns the number of prepended nodes
   */
  prependNextNodes() {
    const current = this.current
    let nodes = current.nextNodes.slice(0).reverse()
    let count = nodes.length
    for (const node of nodes) {
      this.current = node
      count += this.prependNextNodes()
    }

    this.#nodesToWalkQueue = nodes.concat(this.#nodesToWalkQueue)
    this.current = current
    return count
  }

  async execute() {
    while ((this.current = this.#nodesToWalkQueue.shift()) !== undefined) {
      if (this.current.isVisual()) {
        this.prependNextNodes()
      } else if (!this.current.isRunnable) {
        this.#nodesToWalkQueue.splice(-1, 0, ...this.current.nextNodes)
      } else if (this.current.append) {
        const prependedCount = this.prependNextNodes()
        this.#nodesToWalkQueue.push(this.current)

        if (this.current.count) {
          this.current.count = prependedCount
        }
        this.current.append = false
      } else {
        const { args: opArgs, hasVarArg } = this.current.operation
        let args
        if (opArgs.length > 0) {
          args = opArgs.map(() => this.#resultStack.pop())
        } else if (hasVarArg && this.current.count) {
          args = this.#resultStack.splice(-1, this.current.count)
        }

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
        this.#resultStack.push(result)

        cbRes = await this.onHasRun(args, result)
        if (Array.isArray(cbRes)) result = cbRes
        else if (cbRes === NodeWalker.SKIP) continue

        this.#nodesToWalkQueue.splice(-1, 0, ...this.current.nextNodes)
      }
    }
  }
}

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
export const executeNodesAsync = async (root, options = {}) => {
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
export const executeNodes = (root, callback, options = {}) => {
  executeNodesAsync(root, options).then(callback, e => callback(undefined, e))
}

export default executeNodesAsync
