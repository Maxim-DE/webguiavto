import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  err_pool: {
    total_err_count: 0,
    status_err_count: 0
  }
}

export const ErrPoolStoreSlice  = createSlice({
  name: 'errPoolStore',
  initialState,
  reducers: {  
    total_err_increment: (store) => {
      store.err_pool.total_err_count += 1
    },

    status_err_increment: (store) => {
      store.err_pool.status_err_count += 1
    },

    err_erase: (store, action) => {
      const type_to_erase = action.payload

      switch (type_to_erase) {
        case 'status': {
          store.err_pool.status_err_count = 0
          break;
        }
      
        default: {
          store.err_pool.total_err_count = 0
          break;
        }
      }
    }
  }
})

export const {
  total_err_increment,
  status_err_increment,
  err_erase
} = ErrPoolStoreSlice.actions

export default ErrPoolStoreSlice.reducer