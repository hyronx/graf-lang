export const sidebarInitalState = {
  treeData: [
    {
      type: "Class",
      props: {
        index: 0,
        className: "Example",
        isExpanded: false,
      },
      params: [
        {
          type: "Parameter",
          props: {
            index: 0,
            paramName: "a",
            isExpanded: false,
          },
        },
      ],
    },
    {
      type: "AddButton",
      props: {
        type: "Class",
      },
    },
  ],
}

export function sidebar(state = sidebarInitalState, action) {
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

export const getSidebarData = store => store.getState().sidebar.treeData

export const setSidebarData = (store, treeData) => {
  if (!Array.isArray(treeData)) throw new Error("Sidebar data must be an array")

  return store.dispatch({
    type: "SET_SIDEBAR",
    treeData,
  })
}
