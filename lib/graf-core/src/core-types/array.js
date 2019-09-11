// @flow

import { ClassType } from "../types"
import { objectType } from "./object"
import { numberType } from "./number"
import MethodsBuilder from "./methods"

const methodsBuilder = new MethodsBuilder("Array")

export const arrayType = new ClassType({
  name: "Array",
  supertype: objectType,
  description:
    "The JavaScript Array object is a global object" +
    " that is used in the construction of arrays; " +
    "which are high-level, list-like objects.",
  properties: [
    {
      name: "length",
      type: numberType,
      accessType: "public",
      isStatic: false,
    },
    {
      name: "prototype",
      type: objectType,
      accessType: "public",
      isStatic: false,
    },
  ],
  methods: methodsBuilder
    .is({
      reference: Array.isArray,
      aliases: ["isArray"],
    })
    .of({
      reference: Array.of,
    })
    .build(),
})
