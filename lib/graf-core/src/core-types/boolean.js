import { ClassType } from "../types"
import MethodsBuilder from "./methods"
import { objectType } from "./object"

const methodsBuilder = new MethodsBuilder("Boolean")

export const booleanType = new ClassType({
  name: "Boolean",
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
      reference: value => typeof value === "boolean",
    })
    .of({
      reference: value => (value ? true : false),
    })
    .build(),
})
