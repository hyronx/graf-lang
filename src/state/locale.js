const getBrowserLangKey = () => {
  const browserLang = window.navigator.language || window.navigator.userLanguage
  /*
  const lang = supportedLanguages.find(
    ({ langFullKey }) => browserLang === langFullKey
  )
  return lang && lang.langKey
  */
  return browserLang
}

export const localeInitalState = {
  langKey: getBrowserLangKey() || "en",
}

export function locale(state = localeInitalState, action) {
  switch (action.type) {
    case "SET_LANG":
      return {
        ...state,
        langKey: action.langKey,
      }
    default:
      return state
  }
}

export const getLang = store => store.getState().locale.langKey

export const setLang = (store, langKey) =>
  store.dispatch({
    type: "SET_LANG",
    langKey,
  })
