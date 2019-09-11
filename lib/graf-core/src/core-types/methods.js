// @flow

import { OperationTypeInfo, AccessInfo } from "../types"

type MethodDef = {
  reference?: Function,
  aliases?: string[],
}

export class MethodsBuilder {
  methods: (OperationTypeInfo & AccessInfo)[]

  /**
   * Constructs a new MethodBuilder
   * @param {string} className - The class name for which to create the methods
   */
  constructor(className) {
    this.className = className
    this.methods = []
  }

  is({ reference = null, aliases = [] }: MethodDef): MethodsBuilder {
    const isMethod = {
      name: "is",
      description:
        `The ${this.className}.is() method determines ` +
        `whether the passed value is an ${this.className}.`,
      args: [
        {
          name: "value",
          type: "any",
        },
      ],
      result: {
        type: "boolean",
      },
      isAsync: false,
      hasVarArg: false,
      isGenerator: false,
      accessType: "public",
      isStatic: true,
      overrides: null,
      reference,
    }

    this.methods = [
      ...this.methods,
      isMethod,
      aliases.map(a => ({
        name: a,
        target: isMethod,
      })),
    ]
    return this
  }

  of({ reference = null }: MethodDef): MethodsBuilder {
    this.methods = [
      ...this.methods,
      {
        name: "of",
        description:
          `The ${this.className}.of() method converts ` +
          `whether the passed value to an ${this.className}.`,
        args: [
          {
            name: "value",
            type: "any",
          },
        ],
        result: {
          type: "boolean",
        },
        isAsync: false,
        hasVarArg: false,
        isGenerator: false,
        accessType: "public",
        isStatic: true,
        overrides: null,
        reference,
      },
    ]
    return this
  }

  get(methodName: string) {
    return this.methods.find(m => m.name === methodName)
  }

  build() {
    return this.methods
  }
}

export default MethodsBuilder
