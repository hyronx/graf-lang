import { ClassType, OperationType } from "graf-core"

export const sidebarInitialState = {
  treeData: [
    /*
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
    */
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
    return { ...paramField.props, ...prop }
  } else {
    return {
      type: "Parameter",
      props: {
        ...prop,
        index,
        isExpanded: false,
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
    classField.props = { ...classField.props, ...type }
    classField.params = type.properties.map((prop, i) =>
      mapParam(paramFieldNames, paramFields, prop, i)
    )
    return classField
  } else {
    return {
      type: "Class",
      props: {
        ...new ClassType(type).toJSON(),
        index,
        isExpanded: false,
      },
      params: (type.properties || []).map((prop, i) =>
        mapParam([], [], prop, i)
      ),
    }
  }
}

const mapOp = (opFieldNames, opFields, type, index) => {
  const opFieldIndex = opFieldNames.indexOf(type.name)
  if (opFieldIndex > -1 && opFields[opFieldIndex].type === "Operation") {
    const opField = opFields[opFieldIndex]
    const paramFields = opField.params
    const paramFieldNames = paramFields.map(t => t.name)
    opField.props = { ...opField.props, ...type }
    opField.params = type.args.map((prop, i) =>
      mapParam(paramFieldNames, paramFields, prop, i)
    )
    opField.testSets = type.testSets.map(mapTestSet)
    return opField
  } else {
    return {
      type: "Operation",
      props: {
        ...new OperationType(type).toJSON(),
        index,
        isExpanded: false,
      },
      params: (type.args || []).map((prop, i) => mapParam([], [], prop, i)),
      testSets: type.testSets.map(mapTestSet),
    }
  }
}

const mapTestSet = (testSet, index) => ({
  type: "TestSet",
  props: {
    ...testSet,
    index,
    isExpanded: false,
  },
})

export const getSidebarData = store => {
  const { types, sidebar } = store.getState()
  const classFields = sidebar.treeData.filter(data => data.type === "Class")
  const classFieldNames = classFields.map(c => c.name)
  const classes = types
    .filter(type => type.supertype)
    .map((type, i) => mapClass(classFieldNames, classFields, type, i))
  const opFields = sidebar.treeData.filter(data => data.type === "Operation")
  const opFieldNames = sidebar.treeData.map(op => op.name)
  const ops = types
    .filter(type => Array.isArray(type.args))
    .map((type, i) => mapOp(opFieldNames, opFields, type, i))
  return classes.concat(ops).concat(sidebarInitialState.treeData)
}

export const setSidebarData = (store, treeData) => {
  if (!Array.isArray(treeData)) throw new Error("Sidebar data must be an array")

  return store.dispatch({
    type: "SET_SIDEBAR",
    treeData,
  })
}
