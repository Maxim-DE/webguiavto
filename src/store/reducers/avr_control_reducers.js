import { store } from "../store";
import { refreshGlobalStore } from "../global_store_slice";

export const reducers = {

  // обработка запросов на получение данных slave-device в САР
  get_avr_device_data: ({ request_name, request_resp, request_params }) => {

    let obj_to_refresh = {
      global_data: {
        section_data: {
          avr_device_control: {
            device_data: {
              [`device_${request_params.avr_device}`]: request_resp,
            }
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  get_avr_device_availability: ({ request_resp, request_params }) => {

    let obj_to_refresh = {
      global_data: {
        section_data: {
          avr_device_control: {
            device_avaliability: request_resp?.[`device_availiability`]
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // обработка запросов на сохранение данных slave-device в САР
  save_avr_device_data: ({ request_resp, request_params }) => {

    let obj_to_refresh = {
      global_data: {
        section_data: {
          avr_device_control: {
            [`device_${request_params.avr_device}`]: request_resp,
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  }
}