import Cookies from 'react-cookies'

type localStorageKeyType = "userToken" | "userInfo"

export const setLocalstorage = async (key: localStorageKeyType, value: string) => {
  if(typeof window !== "undefined"){
    await window.localStorage.setItem(key, value)
  }
}

export const getLocalstorage = (key: localStorageKeyType) => {
  if(typeof window !== "undefined") {
    return window.localStorage.getItem(key)
  }
}

export const removeLocalstorage = (key: localStorageKeyType[] | localStorageKeyType) => {
  if(typeof window !== "undefined") {
    if (Array.isArray(key)) {
      key.map(v => {
        window.localStorage.removeItem(v)
      })
    } else {
      window.localStorage.removeItem(key)
    }
  }
  Cookies.remove('userToken')
  Cookies.remove('userInfo')
}
