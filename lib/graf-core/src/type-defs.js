import {
  arrayType,
  arrayBufferType,
  numberType,
  stringType,
  booleanType,
  nullType,
  undefinedType,
  objectType,
  functionType,
} from "./core-types"

const coreTypes = {
  "Array": arrayType,
  "ArrayBuffer": arrayBufferType,
  "number": numberType,
  "string": stringType,
  "boolean": booleanType,
  "null": nullType,
  "undefined": undefinedType,
  "object": objectType,
  "Function": functionType,
}

export const getTypes = () => {
  return coreTypes
}

export default getTypes
