import { store } from "../store";
import { refreshGlobalStore } from "../global_store_slice";

import { set_logs_id } from "../../logic/syslog_handle_expand";
import { syslog_handle_expand } from "../../logic/syslog_handle_expand";

export const reducers = {
  userlog_data: ({request_resp}) => {
    const obj_to_refresh = {
      global_data: {
        status_data: {
          status_full_logs: set_logs_id(request_resp.userlog)
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  get_expanded_userlog: ({request_resp, request_params}) => {
    const store_tree = store.getState()

    let log_id = 0

    if (Object.prototype.hasOwnProperty.call(request_params, 'log_num')) {
      log_id = request_params.log_num
    }

    let log_data = JSON.parse(JSON.stringify(store_tree.global_data.status_data.status_full_logs))
    let new_log_data = syslog_handle_expand(request_resp, log_data, log_id)

    const obj_to_refresh = {
      global_data: {
        status_data: {
          status_full_logs: new_log_data
        }
      }
    }
    
    return obj_to_refresh
  }
}