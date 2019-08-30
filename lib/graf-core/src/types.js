// @flow

import Node from "./node"
import { Link } from "./link"
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

  equals(other: TypeInfo): bool;
}

export class Type implements Metatype, TypeInfo {
  typeName = "Type"

  constructor({ name, description }: TypeInfo) {
    this.name = name
    this.description = description
  }

  equals(other: TypeInfo) {
    return this.typeName === other.typeName && this.name === other.name
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
  type?: Type | string;
  supertype?: Type | string;
  generics?: Array<Generic>;
  interfaces?: Array<Type | string>;
  mixins?: Array<Type | string>;
  properties?: Array<ArgumentInfo>;
  methods?: Array<OperationType | string>;
}

export class ClassType extends Type implements ClassTypeInfo {
  typeName = "Class"

  constructor({
    name,
    supertype,
    type,
    description,
    generics,
    interfaces,
    mixins,
    properties,
    methods,
  }: ClassTypeInfo) {
    super({ name, description })

    this.supertype = supertype || type
    this.generics = generics || []
    this.interfaces = interfaces || []
    this.mixins = mixins || []
    this.properties = properties || []
    this.methods = methods || []
  }

  get type() {
    return this.supertype
  }

  toJSON() {
    return {
      ...super.toJSON(),
      supertype: this.supertype,
      type: this.supertype,
      generics: this.generics,
      interfaces: this.interfaces,
      mixins: this.mixins,
      properties: this.properties,
      methods: this.methods,
    }
  }

  static fromJSON(data) {
    return new ClassType(data)
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
  args?: (ArgumentInfo & Metatype)[];
  type?: any;
  hasVarArg?: boolean;
  isAsync?: boolean;
  isGenerator?: boolean;
  code?: {
    nodes: Node[],
    links: Link[],
    text?: string,
  };
}

export class OperationType extends Type implements OperationTypeInfo {
  typeName = "Operation"

  constructor({
    name,
    description,
    result,
    type,
    testSets,
    args,
    hasVarArg,
    isAsync,
    isGenerator,
    code,
  }: OperationTypeInfo) {
    super({ name, description })

    this.result = result || type ? { type } : undefined
    this.testSets = testSets || []
    this.args = args || []
    this.hasVarArg = hasVarArg || false
    this.isAsync = isAsync || false
    this.isGenerator = isGenerator || false
    this.code = code || {
      nodes: [],
      links: [],
    }
  }

  get type() {
    return this.result.type
  }

  toJSON() {
    return {
      ...super.toJSON(),
      result: this.result,
      type: this.result.type,
      testSets: this.testSets,
      args: this.args,
      hasVarArg: this.hasVarArg,
      isAsync: this.isAsync,
      isGenerator: this.isGenerator,
      code: {
        nodes: this.code.nodes,
        links: this.code.links,
      },
    }
  }

  static fromJSON(data) {
    const nodes = data.code.nodes.map(Node.fromJSON).map((node, _, self) => {
      node.onAllNodesMapped(self)
      delete node.onAllNodesMapped
      return node
    })
    const links = data.code.links.map(linkData =>
      Link.fromJSON(linkData, nodes)
    )
    return new OperationType({
      ...data,
      code: {
        nodes,
        links,
      },
    })
  }
}

export default getTypes
