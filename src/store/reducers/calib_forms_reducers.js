import { store } from "../store";
import { refreshGlobalStore } from "../global_store_slice";

import { reload_page } from "../../logic/utilites";
import { syslog_handle_expand } from "../../logic/syslog_handle_expand";
import { set_logs_id } from "../../logic/syslog_handle_expand";

export const reducers = {
  // Обновление данных калибровки при обычном запросе с форм калибровки
  calibration_form: ({request_resp}) => {
    if (Object.keys(request_resp).length == 0) return

    const obj_to_refresh = {
      global_data: {
        calib_state: {
          data: request_resp,
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // Удаление записей польз. журнала
  delete_user_logs: () => {
    const obj_to_refresh = {
      global_data: {
        status_data: {
          status_logs: [],
          status_full_logs: []
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  
  factory_reset: ({request_params}) => {
    if (Object.prototype.hasOwnProperty.call(request_params, 'factory_reset')) {
      reload_page()
    }
  },

  // обработка системного журнала
  syslog_data: ({request_resp}) => {
    const obj_to_refresh = {
      global_data: {
        calib_state: {
          data: {
            calib_misc: {
              sys_log: set_logs_id(request_resp.syslog)
            }
          }
        }
      }
    }
    
    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  delete_sys_logs: () => {
    const obj_to_refresh = {
      global_data: {
        calib_state: {
          data: {
            calib_misc: {
              sys_log: []
            }
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // обработка развернутых логов системного журнала
  get_expanded_syslog: ({request_resp, request_params}) => {
    let store_tree = store.getState()

    let log_id = 0

    if (Object.prototype.hasOwnProperty.call(request_params, 'log_num')) {
      log_id = request_params.log_num
    }

    let log_data = JSON.parse(JSON.stringify(store_tree.global_data.calib_state.data.calib_misc.sys_log))
    let new_log_data = syslog_handle_expand(request_resp, log_data, log_id)

    const obj_to_refresh = {
      global_data: {
        global_data: {
          calib_state: {
            data: {
              calib_misc: {
                sys_log: new_log_data
              }
            }
          }
        }
      }
    }
    
    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // Оработка запросов, связанных с редактированием списка пользователей
  user_list_handling: ({request_resp}) => {
    const obj_to_refresh = {
      global_data: {
        calib_state: {
          data: {
            calib_misc: {
              user_list: request_resp.user_list
            }
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // Оработка запросов, связанных с получением списка slave-устройств
  device_list_handling: ({ request_resp }) => {
    if (!Object.prototype.hasOwnProperty.call(request_resp, 'device_list')) return

    const obj_to_refresh = {
      global_data: {
        calib_state: {
          data: {
            calib_masterSlave: {
              device_list: {
                saved_list: request_resp.user_list
              }
            }
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  device_info_handling: ({ request_resp, request_params }) => {
    if (!Object.hasOwn(request_resp, 'device_info')) return

    let store_tree = store.getState()

    let device_list = store_tree.global_data.calib_state.data.calib_masterSlave.device_list.saved_list

    if (device_list !== undefined) {
      const device_index = device_list.findIndex((element) => element.address === request_params.address)
  
      device_list[device_index].device_info = request_resp.device_info
    }

    const obj_to_refresh = {
      global_data: {
        calib_state: {
          data: {
            calib_masterSlave: {
              device_list: {
                saved_list: device_list
              }
            }
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },
}