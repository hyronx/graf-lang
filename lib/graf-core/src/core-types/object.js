import { ClassType, AccessInfo } from "../types"
import MethodsBuilder from "./methods"
import { Message } from "../message"

const methodsBuilder = new MethodsBuilder("Object")

console.log("Types:", ClassType, AccessInfo, Message)
console.log("Methods:", MethodsBuilder)

export const objectType = new ClassType({
  name: "Object",
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
      reference: value => typeof value === "object",
    })
    .of({
      reference: value => ({ value }),
    })
    .build(),
})
