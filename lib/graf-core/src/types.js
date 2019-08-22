// @flow

import { Argument, Operation } from "./operation"
import { Metatype } from "./meta"

const coreTypes = [
  "Array",
  "ArrayBuffer",
  "number",
  "string",
  "boolean",
  "null",
  "undefined",
  "object",
  "Function",
]

const coreAssertions = {
  Array: arg => Array.isArray(arg),
}

export const getTypes = () => {
  return coreTypes
}

export class Generic implements Metatype {
  typeName = "Generic"
  name: string
  constrain: string
}

interface TypeInfo {
  name: string;
  description: string;
}

export class Type implements Metatype, TypeInfo {
  typeName = "Type"

  constructor({ name, description }: TypeInfo) {
    this.name = name
    this.description = description
  }

  toJSON() {
    return {
      metaData: {
        typeName: this.typeName,
      },
      name: this.name,
      description: this.description,
    }
  }
}

interface ClassTypeInfo extends TypeInfo {
  supertype?: Type | string;
  generics?: Array<Generic>;
  interfaces?: Array<Type | string>;
  mixins?: Array<Type | string>;
  properties?: Array<Argument>;
  methods?: Array<Operation>;
}

export class ClassType extends Type implements ClassTypeInfo {
  typeName = "ClassType"

  constructor({
    name,
    supertype,
    description,
    generics,
    interfaces,
    mixins,
    properties,
    methods,
  }: ClassTypeInfo) {
    super({ name, description })

    this.supertype = supertype
    this.generics = generics || []
    this.interfaces = interfaces || []
    this.mixins = mixins || []
    this.properties = properties || []
    this.methods = methods || []
  }

  toJSON() {
    return {
      ...super.toJSON(),
      supertype: this.supertype,
      generics: this.generics,
      interfaces: this.interfaces,
      mixins: this.mixins,
      properties: this.properties,
      methods: this.methods,
    }
  }
}

export interface ArgumentInfo {
  name: string;
  type: string | Type;
  validator?: Function;
  description?: string;
  value?: any;
}

export interface ResultInfo {
  type: string | Type;
  name?: string;
  description?: string;
}

export interface TestSetInfo {
  inputs: Map<ArgumentInfo, any>;
  output: any;
}

interface OperationTypeInfo extends TypeInfo {
  result?: ResultInfo;
  testSets?: TestSetInfo[];
  args?: ArgumentInfo[];
  hasVarArg?: boolean;
  isAsync?: boolean;
  isGenerator?: boolean;
}

export class OperationType extends Type implements ClassTypeInfo {
  typeName = "ClassType"

  constructor({
    name,
    description,
    result,
    testSets,
    args,
    hasVarArg,
    isAsync,
    isGenerator,
  }: OperationTypeInfo) {
    super({ name, description })

    this.result = result
    this.testSets = testSets || []
    this.args = args || []
    this.hasVarArg = hasVarArg || false
    this.isAsync = isAsync || false
    this.isGenerator = isGenerator || false
  }

  toJSON() {
    return {
      ...super.toJSON(),
      result: this.result,
      testSets: this.testSets,
      args: this.args,
      hasVarArg: this.hasVarArg,
      isAsync: this.isAsync,
      isGenerator: this.isGenerator,
    }
  }
}

export default getTypes
