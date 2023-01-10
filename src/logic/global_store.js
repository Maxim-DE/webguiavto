import React from 'react'
import globalHook from 'use-global-hook' 

const initial_store = {
  status_data: {
    status_info: null,
    status_graph: null,
    status_svg: {
      img: ''
    },
    status_logs: null,
    status_full_logs: null,
    status_settings: null,
    calib_adc: null,
    status_peripheral: null,
    calib_available: 0
  },
  section_data: {
    settings: null,
    network: null,
    rds: null,
    info: null,
  },
  peripheral_data: {
    structure: [],
  },
  calib_state: {
    isOpen: false,
    data: {},
  }
}

const actions = {
  set_status: (store, status_data) => {
    store.setState(status_data)
  },
  set_section: (store, section_data) => {
    store.setState(section_data)
  },
  set_peripheral: (store, peripheral_data) => {
    store.setState(peripheral_data)
  },
  set_calib: (store, calib_data) => {
    store.setState(calib_data)
  }
}

const useGlobalStore = globalHook(initial_store, actions)

export default useGlobalStore