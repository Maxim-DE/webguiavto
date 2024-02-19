import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth_data: {
    user_id : '',
    is_auth : false,
    auth_level: 0,
    auth_access : {
      status: true,
      settings: false,
      calib: false,
      calib_extend: false,
    }
  },
}

export const authStoreSlice = createSlice({
  name: 'authStore',
  initialState,
  reducers: {
    setIsAuth: (store, action) => {
      const is_auth = action.payload
      store.auth_data.is_auth = is_auth
    },
    setUserId: (store, action) => {
      const user_id = action.payload
      store.auth_data.user_id = user_id
    },
    setAuthLevel: (store, action) => {
      const auth_level = action.payload

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

      store.auth_data.auth_access = auth_access
      store.auth_data.auth_level = auth_level
    }
  }
})

export const {
  setIsAuth,
  setUserId,
  setAuthLevel
} = authStoreSlice.actions

export default authStoreSlice.reducer