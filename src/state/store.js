import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { locale, localeInitalState, getLang } from "./locale"
import { sidebar, sidebarInitalState, getSidebarData } from "./sidebar"

const topReducer = combineReducers({
  locale,
  sidebar,
})

const rehydrateStore = () => {
  const sidebar = JSON.parse(window.localStorage.getItem("sidebar"))
  const locale = window.localStorage.getItem("locale")
  return {
    sidebar: sidebar ? sidebar : sidebarInitalState,
    locale: locale ? locale : localeInitalState,
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
    default:
      break
  }
  return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancers = composeEnhancers(applyMiddleware(localStorage))
export const dataStore = createStore(topReducer, rehydrateStore(), enhancers)
