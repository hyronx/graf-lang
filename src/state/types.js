export const typesInitialState = []

const replaceTypes = (state, newTypes) => {
  const types = state.slice(0)
  const typeNames = newTypes.map(t => t.name)
  types
    .sort(a => (typeNames.includes(a.name) ? 1 : -1))
    .splice(types.length - typeNames.length, typeNames.length)
  return types.concat(newTypes)
}

const areTypeSetsDisjoint = (a, b) => {
  const aNames = a.map(t => t.name)
  const bNames = b.map(t => t.name)
  return !aNames.some(n => bNames.includes(n))
}

export function types(state = typesInitialState, action) {
  switch (action.type) {
    case "ADD_TYPES":
      return state.concat(action.types)
    case "REPLACE_TYPES":
      return replaceTypes(state, action.types)
    default:
      return state
  }
}

export const getTypes = store => store.getState().types

export const addTypes = (store, newType, ...otherTypes) => {
  let allNewTypes = Array.isArray(newType)
    ? newType
    : otherTypes.concat([newType])

  return store.dispatch({
    type: areTypeSetsDisjoint(getTypes(store), allNewTypes)
      ? "ADD_TYPES"
      : "REPLACE_TYPES",
    types: allNewTypes,
  })
}
