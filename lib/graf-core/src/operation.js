// @flow

export class Argument {
  /**
   * Creates a new operation Argument instance
   * @param {string} name
   * @param {string} type
   * @param {function|null} validator
   * @param {string|null} description
   * @param {*} value
   */
  constructor(
    name: string,
    type: string,
    validator: ?Function = null,
    description: ?string = null,
    value: ?any = undefined
  ) {
    this.name = name
    this.type = type
    this.validate = validator
    this.description = description
    this.value = value
  }
}

export class Result extends Argument {
  /**
   * Creates a new operation Argument instance
   * @param {string} type
   * @param {string|null} name
   * @param {function|null} validator
   * @param {string|null} description
   */
  constructor(
    type: string,
    name: ?string = null,
    validator: ?Function = null,
    description: ?string = null
  ) {
    super(name || "result", type, validator, description)
  }

  clone() {
    return new Result(this.type, this.name, this.validate, this.description)
  }
}

export class TestSet {
  #inputs: Map<Argument, any>
  #output: any

  constructor(
    output: any,
    inputs: Map<Argument, any> | [Argument, any][] | [Argument, any],
    ...otherInputs: [Argument, any]
  ) {
    if (inputs instanceof Map)
      this.#inputs = inputs
    else if (Array.isArray(inputs) && Array.isArray(inputs[0]))
      this.#inputs = new Map(inputs)
    else if (Array.isArray(inputs) && inputs[0] instanceof Argument)
      this.#inputs = new Map([inputs, ...otherInputs])

    this.#output = output
  }

  get output(): any {
    return this.#output
  }

  get inputs(): Map<Argument, any> {
    return this.#inputs
  }

  getInput(arg: Argument): any {
    return this.#inputs.get(arg)
  }

  toJSON() {
    const inputs = []
    this.#inputs.forEach((value, key) => {
      inputs.push([key, value])
    })

    return {
      output: this.output,
      inputs,
    }
  }

  /**
   * Maps the inputs to its value at the correct position
   */
  mapInputs(opArgs: Argument[]): any {
    const testArgs = opArgs.slice(0)
    for (const [arg, value] of this.inputs) {
      const argIndex = opArgs.indexOf(arg)
      testArgs[argIndex] = value
    }
    return testArgs
  }
}

type OperationOptions = {
  result: ?Result,
  testSets: TestSet[],
  args: ?(Argument[]),
  hasVarArg: ?boolean,
  isAsync: ?boolean,
  isGenerator: ?boolean,
}

export default class Operation {
  doValidate = false
  isAsync: boolean
  isGenerator: boolean
  hasVarArg: boolean
  #testSets: TestSet[]
  #args: Argument[]
  #operation: (...any) => any
  #result: Result

  /**
   * Creates a new Operation
   * @param {function} operation
   * @param {OperationOptions} options
   */
  constructor(operation: (...any) => any, options: OperationOptions = {}) {
    this.#operation = operation
    this.#result = Object.freeze(
      options.result || new Result("undefined", "nothing")
    )
    this.#args = options.args || []
    this.hasVarArg = options.hasVarArg || false
    this.isAsync = options.isAsync || false
    this.isGenerator = options.isGenerator || false
    this.#testSets = options.testSets || []
  }

  get operation() {
    return this.#operation
  }

  get args() {
    return this.#args.slice(0)
  }

  set args(newArgs) {
    if (this.hasVarArg) {
      this.#args = newArgs
      this.hasVarArg = false
    } else {
      throw new Error(
        "The arguments of this operation has already been specified"
      )
    }
  }

  get result() {
    return this.#result
  }

  get testSets() {
    return this.#testSets
  }

  /**
   * Validates the provided array as arguments for this operation
   * @param {*[]} args - The arguments to validate
   * @return {boolean} Returns true if all checks passed and throws otherwise
   */
  validate(args: any[]) {
    args.forEach((a, i) => {
      if (!this.#args[i])
        throw new Error(
          `Argument ${a} has a different type then the expected ${this.#args[i].type}`
        )

      if (this.#args[i].validate && !this.#args[i].validate(a))
        throw new Error(`Argument ${a} is not valid for this operation`)

      if (this.#args[i].type !== a.constructor.name)
        throw new Error(
          `Argument ${a} has a different type then the expected ${this.#args[i].type}`
        )
    })
    return true
  }

  call(thisArg: any, ...argArray) {
    if (this.doValidate) this.validate(argArray)
    return this.#operation.apply(thisArg, argArray)
  }

  apply(thisArg: any, argArray) {
    if (this.doValidate) this.validate(argArray)
    return this.#operation.apply(thisArg, argArray)
  }

  bind(thisArg: any, ...argArray) {
    this.#operation = this.#operation.bind(thisArg, ...argArray)
    return this
  }

  test(thisArg: any, testSet: number | TestSet) {
    let args: Argument[], chosenSet: TestSet
    if (testSet < this.#testSets.length) {
      chosenSet = this.#testSets[testSet]
      args = chosenSet.mapInputs(this.#args)
    } else if (testSet instanceof TestSet) {
      chosenSet = testSet
      args = chosenSet.mapInputs(this.#args)
    } else {
      throw new Error("testSet must either be a TestSet or a number")
    }
    return this.#operation.apply(thisArg, args) === chosenSet.output
  }

  testAll(thisArg: any) {
    return this.#testSets.map(testSet =>
        testSet.output === this.#operation.apply(
          thisArg,
          testSet.mapInputs(this.#args)
        )
    )
  }
}
