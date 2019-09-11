import { ClassType } from "../types"
import MethodsBuilder from "./methods"
import { objectType } from "./object"

const methodsBuilder = new MethodsBuilder("Null")

export const nullType = new ClassType({
  name: "Null",
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
      reference: value => value === null,
    })
    .of({
      reference: () => null,
    })
    .build(),
})
