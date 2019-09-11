import { ClassType } from "../types"
import MethodsBuilder from "./methods"
import { objectType } from "./object"

const methodsBuilder = new MethodsBuilder("Function")

export const functionType = new ClassType({
  name: "Function",
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
      reference: value => typeof value === "function",
    })
    .of({
      reference: value => () => value,
    })
    .build(),
})
