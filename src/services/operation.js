export class Argument {
  /**
   * Creates a new operation Argument instance
   * @param {string} name
   * @param {string} type
   * @param {function|null} validator
   * @param {string|null} description
   */
  constructor(name, type, validator=null, description=null) {
    this.name = name
    this.type = type
    this.validate = validator
    this.description = description
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
  constructor(type, name=null, validator=null, description=null) {
    super(name || "result", type, validator, description)
  }

  clone() {
    return new Result(this.type, this.name, this.validate, this.description)
  }
}

export default class Operation {
  doValidate = false
  isAsync
  isGenerator
  hasVarArg
  #args
  #operation
  #result

  /**
   * Creates a new Operation
   * @param {function} operation
   * @param {{
   *  result: Result|undefined,
   *  args: Argument[]|undefined,
   *  hasVarArg: boolean|undefined,
   *  isAsync: boolean|undefined,
   *  isGenerator: boolean|undefined,
   * }} options
   */
  constructor(
    operation,
    options={},
  ) {
    this.#operation = operation
    this.#result = Object.freeze(
      options.result || new Result("undefined", "nothing")
    )
    this.#args = options.args || []
    this.hasVarArg = options.hasVarArg || false
    this.isAsync = options.isAsync || false
    this.isGenerator = options.isGenerator || false
  }

  get operation() { return this.#operation }

  get args() { return this.#args.slice(0) }

  get result() { return this.#result }

  /**
   * Validates the provided array as arguments for this operation
   * @param {*[]} args - The arguments to validate
   * @return {boolean} Returns true if all checks passed and throws otherwise
   */
  validate(args) {
    args.forEach((a, i) => {
      if (!this.#args[i])
        throw new Error("Too many arguments for this operation")

      if (this.#args[i].validate && !this.#args[i].validate(a))
        throw new Error(`Argument ${a} is not valid for this operation`)

      if (this.#args[i].type !== a.constructor.name)
        throw new Error(`Argument ${a} has a different type then the expected ${this.#args[i].type}`)
    })
    return true
  }

  call(thisArg, ...argArray) {
    if (this.doValidate) this.validate(argArray)
    return this.#operation.call(thisArg, ...argArray)
  }

  apply(thisArg, argArray) {
    if (this.doValidate) this.validate(argArray)
    return this.#operation.apply(thisArg, argArray)
  }

  bind(thisArg, ...argArray) {
    this.#operation = this.#operation.bind(thisArg, ...argArray)
    return this
  }
}
