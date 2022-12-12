import React from 'react'
import useStore from 'use-global-hook'

const initial_store = {
  user_id : '',
  is_auth : false,
  auth_access : {
    status: true,
    settings: false,
    calib: false,
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
    
      default:
        auth_access.status = true
        break;
    }

    store.setState({auth_access})
  }
}

const useGlobalStore = useStore(initial_store, actions)

export default useGlobalStore
