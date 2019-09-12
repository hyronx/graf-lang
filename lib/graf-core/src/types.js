// @flow

import Node from "./node"
import { Link } from "./link"
import { Metatype } from "./meta"

export interface AliasInfo {
  name: string;
  target: TypeInfo;
}

export class Generic implements Metatype {
  typeName = "Generic"
  name: string
  constrain: string
}

interface TypeInfo {
  name: string;
  description: string;
  equals?: (other: TypeInfo) => bool;
}

export class Type implements Metatype, TypeInfo {
  typeName = "Type"

  constructor({ name, description, equals }: TypeInfo) {
    this.name = name
    this.description = description
    this.equals = equals || this.equals.bind(this)
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
  interfaces?: Array<ClassTypeInfo | string>;
  mixins?: Array<ClassTypeInfo | string>;
  properties?: Array<ArgumentInfo & AccessInfo>;
  methods?: Array<(OperationTypeInfo & AccessInfo) | string>;
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
    equals,
  }: ClassTypeInfo) {
    super({ name, description, equals })

    this.supertype = supertype || type
    this.generics = generics || []
    this.interfaces = interfaces || []
    this.mixins = mixins || []
    this.properties = properties || []
    this.methods = this.importMethods(methods || [])
  }

  /**
   * Imports methods from supertype, mixins and interfaces and
   * ensures that the overriding is correct
   * @prop {[]} methods - Pre-defined methods
   * @returns The all methods with correct overriding
   */
  importMethods(methods) {
    let allOverridenMethods = []
    // This check is necessary for Obejct type
    const supertypeMethods = this.supertype
      ? this.supertype.methods.map(m => ({
          typeInfo: this.supertype,
          prop: m,
        }))
      : []

    const mixinsMethods = this.mixins.flatMap(mixin =>
      mixin.methods.map(method => ({
        typeInfo: mixin,
        prop: method,
      }))
    )
    const allMethods = supertypeMethods.concat(mixinsMethods)

    for (const method of methods) {
      const overriddenMethods = allMethods.filter(
        ({ prop }) => prop.name === method.name
      )
      if (overriddenMethods.length) {
        method.overrides = overriddenMethods
        allOverridenMethods = [
          ...allOverridenMethods,
          ...overriddenMethods.map(({ prop }) => prop)
        ]
      }
    }
    return methods.concat(
      allMethods
        .map(({ prop }) => prop)
        .filter(method => !allOverridenMethods.includes(method))
    )
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

export interface AccessInfo {
  accessType: "public" | "protected" | "private";
  isStatic: bool;
  overrides?: Array<{ typeInfo: ClassTypeInfo, prop: TypeInfo }>;
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
  reference?: Function;
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
    reference,
    equals,
  }: OperationTypeInfo) {
    super({ name, description, equals })

    this.result = result || type ? { type } : undefined
    this.testSets = testSets || []
    this.args = args || []
    this.hasVarArg = hasVarArg || false
    this.isAsync = isAsync || false
    this.isGenerator = isGenerator || false
    this.code = code || {/*nodes: [],links: [],*/}
    this.reference = reference || null
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
      code: this.code,
    }
  }

  static fromJSON(data) {
    /*
    const nodes = data.code.nodes.map(Node.fromJSON).map((node, _, self) => {
      node.onAllNodesMapped(self)
      delete node.onAllNodesMapped
      return node
    })
    const links = data.code.links.map(linkData =>
      Link.fromJSON(linkData, nodes)
    )
    */
    return new OperationType({
      ...data,
      /*
      code: {
        nodes,
        links,
      },
      */
    })
  }
}
