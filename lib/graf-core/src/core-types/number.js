import { ClassType } from "../types"
import { objectType } from "./object"
import MethodsBuilder from "./methods"

const methodsBuilder = new MethodsBuilder("Number")

export const numberType = new ClassType({
  name: "Number",
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
      reference: value => typeof value === "number",
    })
    .of({
      reference: value => Number(value),
    })
    .build(),
})
