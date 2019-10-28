
export { SingletonApp, registerFun, store } from './application'
export { default as TaxModules } from './store'
export { default as router } from './router'
export { constantRoutes, resetRouter, concatRouter, generateRouter } from './router'

export { default as utils } from './utils'
export { getToken, setToken, removeToken } from './utils/auth'
export { default as handleClipboard } from './utils/clipboard'
export { default as getPageTitle } from './utils/get-page-title'
export { setItem, getItem } from './utils/local-storage'
export { default as openWindow } from './utils/open-window'
export { default as service } from './utils/request'
export { isExternal, validPhone, validUsername, validURL, validLowerCase, validUpperCase, validAlphabets, validEmail, isString, isArray } from './utils/validate'