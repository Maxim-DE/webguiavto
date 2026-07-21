import { createSlice } from "@reduxjs/toolkit"
import { merge } from "lodash"

const initial_store = {
  global_data: {
    status_data: {
      status_info: {},
      status_graph: {},
      status_svg: {
        img: ''
      },
      status_logs: [],
      status_full_logs: [],
      status_settings: {},
      calib_adc: {},
      status_peripheral: {},
      calib_available: 0
    },
    section_data: {
      settings: {},
      settings_avr: {},
      network: {},
      rds: {},
      info: {},
    },
    peripheral_data: {
      structure: [],
    },
    calib_state: {
      data: {},
    }
  }
}

export const globalStoreSlice = createSlice({
  name: "globalStore",
  initial_store,
  reducers: {
    refreshStore: (state, action) => {
      merge(state.global_data, action.payload)
    }
  }
})

export const { refreshStore } = globalStoreSlice.actions

export default globalStoreSlice.reducer