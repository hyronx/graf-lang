import { ClassType } from "../types"
import MethodsBuilder from "./methods"
import { objectType } from "./object"

const methodsBuilder = new MethodsBuilder("Undefined")

export const undefinedType = new ClassType({
  name: "Undefined",
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
      reference: value => value === undefined,
    })
    .of({
      reference: () => undefined,
    })
    .build(),
})
