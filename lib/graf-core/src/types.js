// @flow

import { Argument, Operation } from "./operation"

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

export const getTypes = () => {
  return coreTypes
}

export class Generic {
  name: string
  constrain: string
}

export class Type {
  name: string
  supertype: Type | string
  description: ?string
  generics: Array<Generic>
  interfaces: Array<Type | string>
  mixins: Array<Type | string>
  properties: Array<Argument>
  methods: Array<Operation>
}

export default getTypes
