import { store } from "../../store/store";
import { refreshGlobalStore } from "../../store/global_store_slice";

export const reducers = {

  // обработка запросов с формы настроек в разделе статуса
  transmitter: ({request_resp}) => {
    const obj_to_refresh = {
      global_data: {
        status_data: {
          status_settings: request_resp
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  }
  
}