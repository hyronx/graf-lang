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
    this.#nodesToWalkQueue = this.getNodesToWalk(root)
      .filter(n => n.isRunnable)
      .sort((a, b) => a.execStep - b.execStep)

    if (options.onTry) this.onTry = options.onTry
    if (options.onWillRun) this.onWillRun = options.onWillRun
    if (options.onHasRun) this.onHasRun = options.onHasRun
  }

  getNodesToWalk(root) {
    let nodesToWalk = root.isLogical() ? [root] : []
    for (const current of root.nextNodes) {
      if (!current.execFlags.skip)
        nodesToWalk = nodesToWalk.concat(this.getNodesToWalk(current))
    }
    return nodesToWalk
  }

  async onTry({ node }) {}

  async onWillRun({ node, args }) {}

  async onHasRun({ node, args, result }) {}

  /**
   * Prepends all following nodes of the current one
   * @return {number} Returns the number of prepended nodes
   */
  prependNextNodes() {
    let nodes = this.current.nextNodes
    this.#nodesToWalkQueue = nodes.concat(this.#nodesToWalkQueue)

    let count = nodes.length
    for (const current of nodes) {
      if (current.isVisual()) nodes = current.nextNodes
      else count += 1
    }
    return count
  }

  appendNode() {
    // Prepend all following nodes of the next right node
    const rightNode = this.current.nextNodes.find(
      n => n.column > this.current.column
    )
    if (rightNode) {
      const currentNode = this.current
      this.current = rightNode
      const prependedCount = this.prependNextNodes()
      this.current = currentNode
      this.#nodesToWalkQueue.push(this.current)

      if (this.current.count) {
        this.current.count = prependedCount
      }
      this.current.append = false
    } else {
      throw new Error("A Node should only be append if there is a node following in the next column")
    }
  }

  async execute() {
    for (this.current of this.#nodesToWalkQueue) {
      this.onTry({ node: this.current })
      if (
        this.current.execFlags.skip ||
        this.current.isVisual() ||
        this.current.isRunnable()
      ) continue

      const { args: opArgs, hasVarArg } = this.current.operation

      let args
      if (opArgs.length > 0) {
        args = this.#resultStack.splice(-opArgs.length, opArgs.length)
      } else if (hasVarArg && this.current.count) {
        args = this.#resultStack.splice(-this.current.count, this.current.count)
      }

      let cbRes = await this.onWillRun({
        node: this.current,
        args,
        resultStack: this.#resultStack.slice(0),
      })
      if (Array.isArray(cbRes)) args = cbRes
      else if (cbRes === NodeWalker.SKIP) continue

      let result
      if (Array.isArray(args)) {
        args = (await Promise.all(args))
          .filter(a => a !== undefined)
          .map(a => a.data)

        result = await this.current.run.apply(this.current, args)
      } else {
        result = await this.current.run()
      }
      this.#resultStack.push(result)

      cbRes = await this.onHasRun({
        node: this.current,
        args,
        result,
        resultStack: this.#resultStack.slice(0),
      })
      if (Array.isArray(cbRes)) result = cbRes
      else if (cbRes === NodeWalker.SKIP) continue

      if (this.current.append === false) {
        // Skip the following right node because it has already been prepended
        this.#nodesToWalkQueue = this.current.nextNodes
          .filter(n => n.column === this.current.column)
          .concat(this.#nodesToWalkQueue)
      } else {
        this.#nodesToWalkQueue = this.current.nextNodes.concat(
          this.#nodesToWalkQueue
        )
      }
    }
  }
  /*
  async execute() {
    while ((this.current = this.#nodesToWalkQueue.shift()) !== undefined) {
      //debugger
      if (this.current.isVisual() || !this.current.isRunnable) {
        this.prependNextNodes()
      } else if (this.current.skip) {
        this.current.skip = false
      } else if (this.current.append) {
        this.appendNode()
      } else {
        const { args: opArgs, hasVarArg } = this.current.operation
        let args
        if (opArgs.length > 0) {
          args = opArgs.map(() => this.#resultStack.pop())
        } else if (hasVarArg && this.current.count) {
          args = this.#resultStack.splice(
            -this.current.count,
            this.current.count
          )
        }

        let cbRes = await this.onWillRun({
          node: this.current,
          args,
          resultStack: this.#resultStack,
        })
        if (Array.isArray(cbRes)) args = cbRes
        else if (cbRes === NodeWalker.SKIP) continue

        let result
        if (Array.isArray(args)) {
          args = (await Promise.all(args))
            .filter(a => a !== undefined)
            .map(a => a.data)

          result = await this.current.run.apply(this.current, args)
        } else {
          result = await this.current.run()
        }
        this.#resultStack.push(result)

        cbRes = await this.onHasRun({
          node: this.current,
          args,
          result,
          resultStack: this.#resultStack,
        })
        if (Array.isArray(cbRes)) result = cbRes
        else if (cbRes === NodeWalker.SKIP) continue

        if (this.current.append === false) {
          // Skip the following right node because it has already been prepended
          this.#nodesToWalkQueue = this.current.nextNodes
            .filter(n => n.column === this.current.column)
            .concat(this.#nodesToWalkQueue)
        } else {
          this.#nodesToWalkQueue = this.current.nextNodes.concat(
            this.#nodesToWalkQueue
          )
        }
      }
    }
  }
}
*/
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
