import React from 'react'
import globalHook from 'use-global-hook'

const initial_store = {
  user_id : '',
  is_auth : false,
  auth_access : {
    status: true,
    settings: false,
    calib: false,
    calib_extend: false,
  }
}

const actions = {
  set_is_auth: (store, bool) => {
    const is_auth = bool
    store.setState({ is_auth })
  },

  set_auth_level: (store, auth_level) => {
    let auth_access = {
      status: false,
      settings: false,
      calib: false,
      calib_extend: false,
    }

    switch (auth_level) {
      case 0:
        auth_access.status = true
        break;

      case 1:
        auth_access.status = true
        auth_access.settings = true
        break

      case 2:
        auth_access.status = true
        auth_access.settings = true
        auth_access.calib = true
        break

      case 3:
        auth_access.status = true
        auth_access.settings = true
        auth_access.calib = true
        auth_access.calib_extend = true
        break
    
      default:
        auth_access.status = true
        break;
    }

    store.setState({auth_access})
  }
}

const useGlobalStore = globalHook(initial_store, actions)

export default useGlobalStore
