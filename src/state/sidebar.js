export const sidebarInitialState = {
  treeData: [
    {
      type: "AddButton",
      props: {
        type: "Class",
      },
    },
    {
      type: "AddButton",
      props: {
        type: "Operation",
      },
    },
  ],
}

export function sidebar(state = sidebarInitialState, action) {
  switch (action.type) {
    case "SET_SIDEBAR":
      return {
        ...state,
        treeData: action.treeData,
      }
    default:
      return state
  }
}

const mapParam = (paramFieldNames, paramFields, prop, index) => {
  const paramFieldIndex = paramFieldNames.indexOf(prop.name)
  if (
    paramFieldIndex > -1 &&
    paramFields[paramFieldIndex].type === "Parameter"
  ) {
    const paramField = paramFields[paramFieldIndex]
    return Object.assign(paramField.props, prop)
  } else {
    return {
      type: "Parameter",
      props: {
        index,
        isExpanded: false,
        ...prop,
      },
    }
  }
}

const mapClass = (classFieldNames, classFields, type, index) => {
  const classFieldIndex = classFieldNames.indexOf(type.name)
  if (classFieldIndex > -1 && classFields[classFieldIndex].type === "Class") {
    const classField = classFields[classFieldIndex]
    const paramFields = classField.params
    const paramFieldNames = paramFields.map(t => t.name)
    classField.props = Object.assign(classField.props, type)
    classField.params = type.properties.map((prop, i) =>
      mapParam(paramFieldNames, paramFields, prop, i)
    )
    return classField
  } else {
    return {
      type: "Class",
      props: {
        index,
        isExpanded: false,
        ...type,
      },
      params: (type.properties || []).map((prop, i) =>
        mapParam([], [], prop, i)
      ),
    }
  }
}

const mapOp = (opFieldNames, opFields, type, index) => {
  const opFieldIndex = opFieldNames.indexOf(type.name)
  if (opFieldIndex > -1 && opFields[opFieldIndex].type === "Class") {
    const opField = opFields[opFieldIndex]
    const paramFields = opField.params
    const paramFieldNames = paramFields.map(t => t.name)
    opField.props = Object.assign(opField.props, type)
    opField.params = type.args.map((prop, i) =>
      mapParam(paramFieldNames, paramFields, prop, i)
    )
    return opField
  } else {
    return {
      type: "Operation",
      props: {
        index,
        isExpanded: false,
        ...type,
      },
      params: (type.args || []).map((prop, i) => mapParam([], [], prop, i)),
    }
  }
}

export const getSidebarData = store => {
  const state = store.getState()
  const classFields = state.sidebar.treeData
  const classFieldNames = classFields.map(t => t.name)
  return state.types
    .map((type, i) => mapClass(classFieldNames, classFields, type, i))
    .concat(sidebarInitialState.treeData)
}

export const setSidebarData = (store, treeData) => {
  if (!Array.isArray(treeData)) throw new Error("Sidebar data must be an array")

  return store.dispatch({
    type: "SET_SIDEBAR",
    treeData,
  })
}
