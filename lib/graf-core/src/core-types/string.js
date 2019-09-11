import { ClassType } from "../types"
import MethodsBuilder from "./methods"
import { objectType } from "./object"

const methodsBuilder = new MethodsBuilder("String")

export const stringType = new ClassType({
  name: "String",
  supertype: null,
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
      reference: value => typeof value === "string",
    })
    .of({
      reference: value => String(value),
    })
    .build(),
})
