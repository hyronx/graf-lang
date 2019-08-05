import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { locale, localeInitialState, getLang } from "./locale"
import { sidebar, sidebarInitialState, getSidebarData } from "./sidebar"
import { types, typesInitialState, getTypes } from "./types"

const topReducer = combineReducers({
  locale,
  sidebar,
  types,
})

const rehydrateStore = () => {
  const sidebar = JSON.parse(window.localStorage.getItem("sidebar"))
  const locale = JSON.parse(window.localStorage.getItem("locale"))
  const types = JSON.parse(window.localStorage.getItem("types"))
  return {
    sidebar: sidebar ? sidebar : sidebarInitialState,
    locale: locale ? locale : localeInitialState,
    types: types ? types : typesInitialState,
  }
}

const localStorage = store => next => action => {
  const result = next(action)
  switch (action.type) {
    case "SET_LANG":
      window.localStorage.setItem(
        "locale",
        JSON.stringify({ langKey: getLang(store) })
      )
      break
    case "SET_SIDEBAR":
      window.localStorage.setItem(
        "sidebar",
        JSON.stringify({ treeData: getSidebarData(store) })
      )
      break
    case "ADD_TYPES":
    case "REPLACE_TYPES":
      window.localStorage.setItem("types", JSON.stringify(getTypes(store)))
      break
    default:
      break
  }
  return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancers = composeEnhancers(applyMiddleware(localStorage))
export const dataStore = createStore(topReducer, rehydrateStore(), enhancers)
