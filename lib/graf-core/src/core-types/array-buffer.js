// @flow

import { ClassType } from "../types"
import { objectType } from "./object"
import MethodsBuilder from "./methods"

const methodsBuilder = new MethodsBuilder("ArrayBuffer")

export const arrayBufferType = new ClassType({
  name: "ArrayBuffer",
  supertype: objectType,
  properties: [
    {
      name: "prototype",
      type: objectType,
      accessType: "public",
      isStatic: false,
    },
  ],
  methods: methodsBuilder
    .is({
      reference: value => value instanceof ArrayBuffer,
    })
    .of({
      reference: value => new ArrayBuffer(Number(value)),
    })
    .build(),
})
