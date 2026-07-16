import { createSlice } from "@reduxjs/toolkit"
import { merge, mergeWith } from "lodash"

const initialState = {
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
      network: {},
      avr_device_control: {
        device_avaliability: {},
        device_data: {},
      },
      rds: {},
      info: {},
    },
    peripheral_data: {
      structure: [],
    },
    calib_state: {
      data: {},
    }
  },
}

export const globalStoreSlice = createSlice({
  name: "globalStore",
  initialState,
  reducers: {
    refreshGlobalStore: (state, action) => {
      const data_to_merge = action.payload
      state = mergeWith(state, data_to_merge, (src, obj) => {
        if (Array.isArray(obj)) {
          return obj;
        }
      })
    },
  }
})


export const { 
  refreshGlobalStore
 } = globalStoreSlice.actions

export default globalStoreSlice.reducer