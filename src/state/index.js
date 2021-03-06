import {
  getSidebarData as _getSidebarData,
  setSidebarData as _setSidebarData,
} from "./sidebar"
import { getLang as _getLang, setLang as _setLang } from "./locale"
import { dataStore } from "./store"
import { getTypes as _getTypes, addTypes as _addTypes } from "./types"

export const getSidebarData = _getSidebarData.bind(undefined, dataStore)
export const setSidebarData = _setSidebarData.bind(undefined, dataStore)
export const getLang = _getLang.bind(undefined, dataStore)
export const setLang = _setLang.bind(undefined, dataStore)
export const getTypes = _getTypes.bind(undefined, dataStore)
export const addTypes = _addTypes.bind(undefined, dataStore)
