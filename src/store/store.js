import { configureStore } from "@reduxjs/toolkit";

import globalStoreReducer from './global_store_slice'
import authStoreReducer from "./auth_store_slice";
import errPoolStoreReducer from "./errPool_store_slice";

export const store = configureStore({
  reducer: {
    globalStore: globalStoreReducer,
    authStore: authStoreReducer,
    errPoolStore: errPoolStoreReducer
  }
})