import { store } from "../store"
import { refreshGlobalStore } from "../global_store_slice"
import { err_erase } from "../errPool_store_slice"

export const reducers = {
  status_section: ({request_resp}) => {   
    const store_tree = store.getState()

    let obj_to_refresh = {
      global_data: {
        status_data: request_resp
      }
    }

    if (store_tree.errPoolStore.err_pool.status_err_count > 0) {
      store.dispatch(err_erase('status'))
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  get_status_graph: ({request_resp}) => {
    
    let obj_to_refresh = {
      global_data: {
        status_data: {
          status_svg: {
            img: request_resp
          }
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },
}